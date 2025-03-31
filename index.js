document.addEventListener('DOMContentLoaded', function() {
  // ===== Device Detection =====
  const isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (
        isMobile.Android() || 
        isMobile.BlackBerry() || 
        isMobile.iOS() || 
        isMobile.Opera() || 
        isMobile.Windows()
      );
    }
  };

  // ===== Responsive Theme Toggle =====
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  
  // Mobile-optimized theme switching
  const handleThemeToggle = () => {
    const isDark = !body.classList.contains('dark-mode');
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Mobile-specific adjustments
    if (isMobile.any()) {
      // Reduce motion for mobile devices
      if (isMobile.iOS()) {
        document.documentElement.style.setProperty('--transition-time', '0.2s');
      }
      
      // Force repaint for smoother transition
      void themeToggle.offsetWidth;
    }
  };

  // Initialize theme with mobile consideration
  const initTheme = () => {
    const savedMode = localStorage.getItem('dark-mode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isMobile.any()) {
      // Default to light mode on mobile unless explicitly set
      if (savedMode === 'true') {
        body.classList.add('dark-mode');
      } else if (savedMode === null && systemPrefersDark) {
        body.classList.add('dark-mode');
      }
    } else {
      // Desktop behavior
      if (savedMode === 'true' || (savedMode === null && systemPrefersDark)) {
        body.classList.add('dark-mode');
      }
    }
  };

  themeToggle.addEventListener('click', handleThemeToggle);
  initTheme();

  // ===== Mobile Navigation =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  const toggleMobileMenu = () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (navLinks.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Close menu when clicking outside
      document.addEventListener('click', closeMenuOnClickOutside);
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('click', closeMenuOnClickOutside);
    }
  };
  
  const closeMenuOnClickOutside = (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      toggleMobileMenu();
    }
  };
  
  hamburger.addEventListener('click', toggleMobileMenu);
  
  // Close menu when clicking links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // ===== Mobile-Optimized Smooth Scrolling =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Mobile-specific adjustments
        let offset = 0;
        if (isMobile.any()) {
          offset = 80; // Account for fixed header
          if (isMobile.iOS()) {
            // iOS-specific adjustments
            offset = 100;
          }
        }
        
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        // Use native smooth scroll on mobile for better performance
        if (isMobile.any()) {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        } else {
          // Use GSAP for desktop if available
          if (typeof gsap !== 'undefined') {
            gsap.to(window, {
              duration: 0.8,
              scrollTo: { y: targetPosition, autoKill: false },
              ease: 'power2.out'
            });
          } else {
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          toggleMobileMenu();
        }
      }
    });
  });

  // ===== Touch Device Optimizations =====
  if (isMobile.any()) {
    // Add touch-specific classes
    document.documentElement.classList.add('touch-device');
    
    // Remove hover states on touch devices
    document.documentElement.style.setProperty('--hover-opacity', '1');
    
    // Increase tap targets
    document.querySelectorAll('button, a, [role="button"]').forEach(el => {
      el.style.minHeight = '44px';
      el.style.minWidth = '44px';
    });
  }

  // ===== Performance-Optimized Animations =====
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Mobile-friendly animation settings
    const animationSettings = {
      defaults: {
        duration: isMobile.any() ? 0.6 : 1,
        ease: isMobile.any() ? 'power1.out' : 'power2.out'
      },
      scrollTrigger: {
        scrub: isMobile.any() ? false : true,
        markers: false
      }
    };
    
    // Hero animations with mobile adjustments
    gsap.from(".hero-content", {
      opacity: 0,
      y: isMobile.any() ? 30 : 50,
      ...animationSettings.defaults,
      delay: 0.3
    });
    
    // Only run complex animations on desktop
    if (!isMobile.any()) {
      gsap.to(".tech-icons i", {
        y: -70,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        delay: 1,
        ease: "back.out(1.7)"
      });
      
      // Floating particles (desktop only)
      const particlesContainer = document.querySelector('.particles-container');
      if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'particle';
          particle.style.cssText = `
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            width: ${Math.random() * 3 + 2}px;
            height: ${Math.random() * 3 + 2}px;
          `;
          
          gsap.to(particle, {
            x: `+=${(Math.random() - 0.5) * 50}`,
            y: `+=${(Math.random() - 0.5) * 50}`,
            duration: Math.random() * 15 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
          
          particlesContainer.appendChild(particle);
        }
      }
    }
    
    // Mobile-optimized scroll animations
    gsap.utils.toArray("[data-animate]").forEach(el => {
      const settings = {
        y: isMobile.any() ? 30 : 50,
        opacity: 0,
        ...animationSettings.defaults,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      };
      
      gsap.from(el, settings);
    });
  }

  // ===== Mobile-Specific Event Handlers =====
  if (isMobile.any()) {
    // Better touch feedback
    document.querySelectorAll('.btn, .project-card').forEach(el => {
      el.addEventListener('touchstart', function() {
        this.classList.add('touching');
      }, { passive: true });
      
      el.addEventListener('touchend', function() {
        this.classList.remove('touching');
      }, { passive: true });
    });
    
    // Prevent zoom on double-tap
    let lastTap = 0;
    document.addEventListener('touchend', function(e) {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
      }
      lastTap = currentTime;
    }, { passive: false });
  }

  // ===== Responsive Resize Handler =====
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Recalculate anything that needs to adjust on resize
      if (navLinks.classList.contains('active')) {
        toggleMobileMenu();
      }
      
      // Refresh ScrollTrigger on resize
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  });
});

// ===== Load Event for Final Adjustments =====
window.addEventListener('load', function() {
  // Set a class when fully loaded
  document.documentElement.classList.add('loaded');
  
  // Mobile-specific load adjustments
  if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
    // Fix for iOS viewport height
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    
    // iOS hover fix
    document.body.addEventListener('touchstart', function() {}, { passive: true });
  }
});

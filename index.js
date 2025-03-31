document.addEventListener('DOMContentLoaded', function() {
  // ===== Enhanced Theme Toggle =====
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const toggleBall = document.querySelector('.toggle-ball');
  const moonIcon = document.querySelector('.fa-moon');
  const sunIcon = document.querySelector('.fa-sun');
  
  // System preference listener
  const colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Apply theme with smooth transitions
  const applyTheme = (isDark) => {
    if (isDark) {
      body.classList.add('dark-mode');
      toggleBall.style.transform = 'translateX(30px)';
      moonIcon.style.opacity = '0';
      sunIcon.style.opacity = '1';
    } else {
      body.classList.remove('dark-mode');
      toggleBall.style.transform = 'translateX(0)';
      moonIcon.style.opacity = '1';
      sunIcon.style.opacity = '0';
    }
  };
  
  // Initialize theme
  const initTheme = () => {
    const savedMode = localStorage.getItem('darkMode');
    const systemPrefersDark = colorSchemeMedia.matches;
    
    if (savedMode === null) {
      applyTheme(systemPrefersDark);
      localStorage.setItem('darkMode', systemPrefersDark);
    } else {
      applyTheme(savedMode === 'true');
    }
  };
  
  // Toggle handler with animation
  themeToggle.addEventListener('click', () => {
    const isDark = !body.classList.contains('dark-mode');
    applyTheme(isDark);
    localStorage.setItem('darkMode', isDark);
  });
  
  // Watch for system preference changes
  colorSchemeMedia.addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
      applyTheme(e.matches);
    }
  });
  
  initTheme();

  // ===== Responsive Navigation =====
  const navBar = document.querySelector('header');
  const navContainer = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  const logo = document.querySelector('.logo');
  const navItems = document.querySelectorAll('.nav-links li');
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  const headerHeight = navBar.offsetHeight;

  // Device detection
  function isMobile() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function isTablet() {
    return window.matchMedia('(max-width: 1024px)').matches && !isMobile();
  }

  function isDesktop() {
    return !isMobile() && !isTablet();
  }

  // Responsive navigation setup
  function setupResponsiveNav() {
    if (isMobile()) {
      setupMobileNav();
    } else if (isTablet()) {
      setupTabletNav();
    } else {
      setupDesktopNav();
    }
  }

  // Mobile navigation
  function setupMobileNav() {
    navLinks.style.display = 'none';
    hamburger.style.display = 'flex';

    hamburger.addEventListener('click', toggleMobileMenu);

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    function animateMenuItems() {
      navItems.forEach((item, index) => {
        gsap.fromTo(item,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, delay: index * 0.1 }
        );
      });
    }

    function toggleMobileMenu() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('nav-active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';

      if (navLinks.classList.contains('active')) {
        animateMenuItems();
      }
    }

    function closeMobileMenu() {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-active');
      document.body.style.overflow = '';
    }
  }

  // Tablet navigation
  function setupTabletNav() {
    navLinks.style.display = 'flex';
    hamburger.style.display = 'none';
    document.body.classList.remove('nav-active');
    document.body.style.overflow = '';

    navItems.forEach((item, index) => {
      item.style.marginLeft = index === 0 ? '0' : '20px';
    });

    setupHoverEffects();
  }

  // Desktop navigation
  function setupDesktopNav() {
    navLinks.style.display = 'flex';
    hamburger.style.display = 'none';
    document.body.classList.remove('nav-active');
    document.body.style.overflow = '';

    navItems.forEach((item, index) => {
      item.style.marginLeft = index === 0 ? '0' : '30px';
    });

    setupHoverEffects();
    setupDropdownMenus();
  }

  // Hover effects
  function setupHoverEffects() {
    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { 
          y: -2,
          duration: 0.2,
          ease: "power1.out"
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { 
          y: 0,
          duration: 0.2,
          ease: "power1.out"
        });
      });
    });
  }

  // Dropdown menus
  function setupDropdownMenus() {
    dropdownParents.forEach(item => {
      const dropdown = item.querySelector('.dropdown');
      
      item.addEventListener('mouseenter', () => {
        gsap.to(dropdown, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: "power1.out"
        });
      });
      
      item.addEventListener('mouseleave', () => {
        gsap.to(dropdown, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power1.in"
        });
      });
    });
  }

  // Sticky navigation
  function setupStickyNav() {
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
        navBar.style.transform = 'translateY(-100%)';
      } else {
        navBar.style.transform = 'translateY(0)';
      }
      
      if (currentScroll > 50) {
        navBar.classList.add('scrolled');
      } else {
        navBar.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }

  // Initialize navigation
  setupResponsiveNav();
  setupStickyNav();

  // Handle resize events
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupResponsiveNav();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  });

  // ===== Smooth Scrolling =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (navLinks.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('nav-active');
        document.body.style.overflow = '';
      }
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== Back to Top Button =====
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('active', window.scrollY > 300);
    });
    
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== Project Filtering =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter || 'all';
        projectCards.forEach(card => {
          card.style.display = filter === 'all' || card.dataset.category === filter 
            ? 'block' 
            : 'none';
          
          if (filter === 'all' || card.dataset.category === filter) {
            gsap.fromTo(card, 
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5 }
            );
          }
        });
      });
    });
  }

  // ===== Typing Animation =====
  const typedTextSpan = document.querySelector('.typed-text');
  if (typedTextSpan) {
    const textArray = typedTextSpan.dataset.roles 
      ? JSON.parse(typedTextSpan.dataset.roles) 
      : ['Developer', 'Designer', 'Creator'];
    const typingDelay = 150;
    const erasingDelay = 100;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }
    
    function erase() {
      if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, typingDelay);
      }
    }
    
    setTimeout(type, newTextDelay + 100);
  }

  // ===== GSAP Animations =====
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section animations
    gsap.from(".hero-content", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.5,
      ease: "power2.out"
    });
    
    gsap.from(".photo-frame", {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      delay: 0.8,
      ease: "back.out(1.7)"
    });
    
    // Tech icons animation
    gsap.to(".tech-icons i", {
      y: -70,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      delay: 1.5,
      ease: "back.out(1.7)"
    });
    
    // Section entrance animations
    gsap.utils.toArray("section").forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    });
    
    // Skill bars animation
    gsap.utils.toArray(".skill-progress").forEach(bar => {
      gsap.to(bar, {
        width: bar.dataset.width + "%",
        scrollTrigger: {
          trigger: bar.parentElement,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        duration: 1.5,
        ease: "power3.out"
      });
    });
    
    // Stats counter animation
    const statSection = document.querySelector('.about-stats');
    if (statSection) {
      let statsAnimated = false;
      
      const animateStats = () => {
        if (!statsAnimated && isElementInViewport(statSection)) {
          statsAnimated = true;
          document.querySelectorAll('.stat-number').forEach(stat => {
            const target = parseInt(stat.parentElement.dataset.value);
            const increment = target / 50;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                clearInterval(timer);
                stat.textContent = target + '+';
              } else {
                stat.textContent = Math.floor(current) + '+';
              }
            }, 20);
          });
        }
      };
      
      const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom >= 0
        );
      };
      
      animateStats();
      window.addEventListener('scroll', animateStats);
    }
  }

  // ===== Floating Particles Background =====
  const particlesContainer = document.querySelector('.particles-container');
  if (particlesContainer && typeof gsap !== 'undefined') {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      gsap.to(particle, {
        x: `+=${(Math.random() - 0.5) * 100}`,
        y: `+=${(Math.random() - 0.5) * 100}`,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      particlesContainer.appendChild(particle);
    }
  }

  // ===== Form Handling =====
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success';
        successMsg.textContent = 'Message sent successfully!';
        contactForm.appendChild(successMsg);
        
        contactForm.reset();
        submitBtn.textContent = originalBtnText;
        
        setTimeout(() => {
          successMsg.remove();
        }, 3000);
      } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.textContent = 'Error - Try Again';
        setTimeout(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  }
});

window.addEventListener('load', function() {
  if (typeof gsap !== 'undefined') {
    gsap.to(window, { duration: 0.3, scrollTo: 0 });
  }
});

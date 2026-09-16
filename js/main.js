/* ============================================
   TWO POINT ONE MEDIA — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Navigation Scroll Effect ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // --- Mobile Menu ---
  const menuButton = document.querySelector('.menu-button');
  const fullscreenMenu = document.querySelector('.fullscreen-menu');
  
  if (menuButton && fullscreenMenu) {
    menuButton.addEventListener('click', () => {
      menuButton.classList.toggle('active');
      fullscreenMenu.classList.toggle('active');
      document.body.style.overflow = fullscreenMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    const menuLinks = fullscreenMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuButton.classList.remove('active');
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
        menuButton.classList.remove('active');
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      try {
        // Formspree endpoint — configured by Hermes. Do NOT fall back to a fake
        // success state: a visitor must never see "thanks" for a message that
        // was never sent.
        const FORM_ENDPOINT = 'https://formspree.io/f/xeaoqqwo';

        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
          const detail = await response.json().catch(() => ({}));
          const message = (detail.errors || []).map((err) => err.message).join(' ');
          throw new Error(message || 'Submission failed');
        }

        // Success state
        contactForm.reset();
        formStatus.className = 'form-status success';
        formStatus.textContent = "Thanks — we'll be in touch within one business day.";

      } catch (error) {
        formStatus.className = 'form-status error';
        formStatus.textContent = (error && error.message && error.message !== 'Submission failed')
          ? `${error.message} You can also email info@twopointone.media.`
          : 'Sorry, something went wrong. Please email info@twopointone.media.';
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // --- Color Transition Circles (Simpler Version) ---
  const transitionSection = document.querySelector('.section-transition');
  const circles = document.querySelectorAll('.transition-circle');
  
  if (transitionSection && circles.length > 0) {
    const transitionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          circles.forEach((circle, index) => {
            setTimeout(() => {
              circle.style.transition = 'opacity 1s ease, transform 1.5s ease';
              circle.style.opacity = '0.3';
              circle.style.transform = 'scale(1)';
            }, index * 200);
          });
          transitionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    transitionObserver.observe(transitionSection);
  }

  // --- Active Nav Link Highlighting ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || 
        (linkPath === '/index.html' && (currentPath === '/' || currentPath === '')) ||
        (linkPath.endsWith('.html') && currentPath.endsWith(linkPath))) {
      link.classList.add('active');
    }
  });

  // --- Hero Video Autoplay Check ---
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('loadeddata', () => {
      heroVideo.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    });
  }

});
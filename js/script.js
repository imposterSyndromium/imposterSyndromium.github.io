// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  if (mobileMenuBtn && navLinks) {
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', function() {
      const isExpanded = navLinks.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
      mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Close menu' : 'Open menu');
    });

    // Handle dropdowns on mobile
    dropdownItems.forEach(item => {
      const link = item.querySelector('a');
      if (link) {
        link.addEventListener('click', function(e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            const isExpanded = item.classList.toggle('active');
            link.setAttribute('aria-expanded', isExpanded);
          }
        });
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        dropdownItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        dropdownItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      // Close mobile menu if open
      const navLinks = document.querySelector('.nav-links');
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
      }

      // Smooth scroll to target
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL without page reload
      history.pushState(null, '', targetId);
    }
  });
});

// Enhanced scroll animations with performance optimizations
const sections = document.querySelectorAll('.section');
const cards = document.querySelectorAll('.card, .product-card, .download-card, .update-card, .support-card');

// Function to reset element styles for animation
function resetElementStyles(element) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
}

// Function to animate element
function animateElement(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
}

// Set up initial styles with will-change for better performance
sections.forEach(section => {
  resetElementStyles(section);
  section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  section.style.willChange = 'opacity, transform';
});

cards.forEach(card => {
  resetElementStyles(card);
  card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  card.style.willChange = 'opacity, transform';
});

// Create intersection observer for sections with optimized settings
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateElement(entry.target);
      // Unobserve after animation to improve performance
      sectionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '50px'
});

// Create intersection observer for cards with optimized settings
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateElement(entry.target);
      // Unobserve after animation to improve performance
      cardObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '50px'
});

// Observe all sections and cards
sections.forEach(section => sectionObserver.observe(section));
cards.forEach(card => cardObserver.observe(card));

// Optimized scroll event listener with requestAnimationFrame
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollPosition = window.scrollY;
      
      // Add parallax effect to hero section
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
      }
      
      // Add subtle scale effect to cards when they're in view
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInView) {
          const distanceFromCenter = Math.abs(rect.top + rect.height/2 - window.innerHeight/2);
          const scale = 1 - (distanceFromCenter / window.innerHeight) * 0.1;
          card.style.transform = `translateY(0) scale(${scale})`;
        }
      });
      
      ticking = false;
    });
    ticking = true;
  }
}); 
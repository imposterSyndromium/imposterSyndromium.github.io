/**
 * Main JavaScript File for Robin O'Brien Personal Portfolio Website
 * 
 * Handles:
 * - Mobile menu toggle functionality
 * - Smooth scrolling for anchor links
 * - Scroll-based animations using Intersection Observer API
 * - Parallax effects on hero section
 * - Performance-optimized scroll handling
 */

/**
 * Mobile Menu Functionality
 * Initializes mobile menu toggle, dropdown handling, and accessibility features
 * Note: This functionality is also partially duplicated in header-include.js
 * TODO: Consider consolidating mobile menu logic into a single module
 */
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

/**
 * Smooth Scrolling for Anchor Links
 * Enables smooth scrolling behavior for all internal page anchors
 * Also handles mobile menu closure when navigating to anchor links
 */
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

/**
 * Enhanced Scroll Animations with Performance Optimizations
 * Uses Intersection Observer API for efficient scroll-based animations
 * Animates sections and cards as they enter the viewport
 */
const sections = document.querySelectorAll('.section');
const cards = document.querySelectorAll('.card, .product-card, .download-card, .update-card, .support-card');

/**
 * Reset element styles for animation
 * Sets initial opacity and transform values before animation
 * @param {HTMLElement} element - The element to reset
 */
function resetElementStyles(element) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(20px)';
}

/**
 * Animate element into view
 * Applies opacity and transform transitions for fade-in effect
 * @param {HTMLElement} element - The element to animate
 */
function animateElement(element) {
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
}

/**
 * Set up initial styles with will-change for better performance
 * Prepares elements for animation using CSS will-change property
 * This hints to the browser about upcoming animations for optimization
 * Only apply animations on larger screens to avoid mobile visibility issues
 */
const isMobile = window.innerWidth <= 768;

if (!isMobile) {
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
} else {
  // On mobile, ensure cards are visible immediately
  sections.forEach(section => {
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
  });

  cards.forEach(card => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
}

/**
 * Intersection Observer for Sections
 * Observes when sections enter the viewport and triggers animations
 * Unobserves elements after animation to improve performance
 */
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

/**
 * Intersection Observer for Cards
 * Observes when cards enter the viewport and triggers animations
 * Unobserves elements after animation to improve performance
 */
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

/**
 * Observe all sections and cards for intersection events
 * Only on non-mobile devices to avoid visibility issues on mobile
 */
if (!isMobile) {
  sections.forEach(section => sectionObserver.observe(section));
  cards.forEach(card => cardObserver.observe(card));
}

/**
 * Optimized Scroll Event Listener
 * Uses requestAnimationFrame to throttle scroll events for performance
 * Implements parallax effect on hero section and dynamic card scaling
 * Only apply dynamic effects on desktop to avoid mobile performance issues
 */
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

      // Add subtle scale effect to cards when they're in view (desktop only)
      if (!isMobile) {
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight && rect.bottom >= 0;

          if (isInView) {
            const distanceFromCenter = Math.abs(rect.top + rect.height/2 - window.innerHeight/2);
            const scale = 1 - (distanceFromCenter / window.innerHeight) * 0.1;
            card.style.transform = `translateY(0) scale(${scale})`;
          }
        });
      }

      ticking = false;
    });
    ticking = true;
  }
}); 
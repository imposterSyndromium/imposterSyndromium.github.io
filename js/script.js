// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
  });

  // Handle dropdowns on mobile
  dropdownItems.forEach(item => {
    const link = item.querySelector('a');
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('active');
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
      navLinks.classList.remove('active');
      dropdownItems.forEach(item => item.classList.remove('active'));
    }
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu after clicking a link
      navLinks.classList.remove('active');
    }
  });
});

// Enhanced scroll animations
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

// Set up initial styles
sections.forEach(section => {
  resetElementStyles(section);
  section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
});

cards.forEach(card => {
  resetElementStyles(card);
  card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
});

// Create intersection observer for sections
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateElement(entry.target);
    } else {
      resetElementStyles(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px'
});

// Create intersection observer for cards
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateElement(entry.target);
    } else {
      resetElementStyles(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px'
});

// Observe all sections and cards
sections.forEach(section => sectionObserver.observe(section));
cards.forEach(card => cardObserver.observe(card));

// Add scroll event listener for additional effects
window.addEventListener('scroll', () => {
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
}); 
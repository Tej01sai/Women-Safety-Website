// Loading Animation
window.addEventListener('load', function() {
  setTimeout(() => {
    document.getElementById('loadingOverlay').classList.add('hidden');
  }, 1000);
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', function() {
  navMenu.classList.toggle('active');
  
  // Animate hamburger menu
  const spans = menuToggle.querySelectorAll('span');
  spans.forEach((span, index) => {
    if (navMenu.classList.contains('active')) {
      if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
      if (index === 1) span.style.opacity = '0';
      if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      span.style.transform = 'none';
      span.style.opacity = '1';
    }
  });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Close mobile menu if open
      navMenu.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
      });
    }
  });
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-item, .testimonial-item, .stat-item').forEach(el => {
  observer.observe(el);
});

// Counter Animation for Statistics
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  counters.forEach(counter => {
    const target = counter.innerText;
    const isPercentage = target.includes('%');
    const isPlus = target.includes('+');
    const isSlash = target.includes('/');
    
    let finalNumber;
    if (isPercentage) {
      finalNumber = parseFloat(target);
    } else if (isPlus) {
      finalNumber = parseInt(target.replace(/[^\d]/g, ''));
    } else if (isSlash) {
      return; // Skip 24/7 counter
    } else {
      finalNumber = parseInt(target);
    }
    
    if (isNaN(finalNumber)) return;
    
    let current = 0;
    const increment = finalNumber / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalNumber) {
        current = finalNumber;
        clearInterval(timer);
      }
      
      if (isPercentage) {
        counter.innerText = current.toFixed(1) + '%';
      } else if (isPlus) {
        if (finalNumber >= 1000) {
          counter.innerText = Math.floor(current / 1000) + 'K+';
        } else {
          counter.innerText = Math.floor(current) + '+';
        }
      }
    }, 20);
  });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Enhanced Form Handling
document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  
  const button = e.target.querySelector('button[type="submit"]');
  const originalText = button.innerHTML;
  
  // Show loading state
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  button.disabled = true;

  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    message: document.getElementById("message").value.trim()
  };

  try {
    // Simulate API call (replace with your actual endpoint)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success state
    button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    button.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
    
    // Show success message
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    this.reset();
    
    // Reset button after 3 seconds
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
      button.style.background = '';
    }, 3000);
    
  } catch (error) {
    // Error state
    button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error occurred';
    button.style.background = 'linear-gradient(135deg, #e17055, #d63031)';
    
    alert("Something went wrong. Please try again or contact us directly.");
    
    // Reset button after 3 seconds
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
      button.style.background = '';
    }, 3000);
  }
});

// Add parallax effect to hero section
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  const rate = scrolled * -0.5;
  
  if (hero) {
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero h2');
    const originalText = heroTitle.textContent;
    typeWriter(heroTitle, originalText, 50);
  }, 1500);
});

// Add floating animation to feature icons
document.addEventListener('DOMContentLoaded', function() {
  const featureIcons = document.querySelectorAll('.feature-icon i');
  
  featureIcons.forEach((icon, index) => {
    icon.style.animation = `floatAnimation 3s ease-in-out infinite`;
    icon.style.animationDelay = `${index * 0.5}s`;
  });
});

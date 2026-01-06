/* ============================================
   PERSONAL PORTFOLIO WEBSITE - JAVASCRIPT
   Week 3 Project: Adding Interactive Features
   ============================================ */

/* ============================================
   1. INITIALIZATION & GLOBAL VARIABLES
   ============================================ */

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Portfolio JavaScript loaded successfully!');
  
  // Initialize all features
  initDarkMode();
  initSmoothScroll();
  initNavHighlight();
  initTypingEffect();
  initFormValidation();
  initSkillsAnimation();
  initProjectFilters();
  initImageGallery();
  initScrollToTop();
  initMobileMenu();
  initContactFormSubmit();
  initThemeCustomizer();
  
  // Log initialization complete
  console.log('✅ All interactive features initialized');
});

/* ============================================
   2. DARK MODE TOGGLE
   ============================================ */

function initDarkMode() {
  const darkModeToggle = createDarkModeButton();
  const savedMode = localStorage.getItem('darkMode');
  
  // Apply saved preference
  if (savedMode === 'enabled') {
    document.body.classList.add('dark-mode');
    updateDarkModeButton(darkModeToggle, true);
  }
  
  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Save preference
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    updateDarkModeButton(darkModeToggle, isDark);
    
    // Show notification
    showNotification(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
  });
}

function createDarkModeButton() {
  const button = document.createElement('button');
  button.id = 'dark-mode-toggle';
  button.className = 'dark-mode-toggle';
  button.innerHTML = '☀️';
  button.setAttribute('aria-label', 'Toggle dark mode');
  button.title = 'Toggle dark mode';
  document.body.appendChild(button);
  return button;
}

function updateDarkModeButton(button, isDark) {
  button.innerHTML = isDark ? '🌙' : '☀️';
  button.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
}

/* ============================================
   3. SMOOTH SCROLLING FOR NAVIGATION
   ============================================ */

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, `#${targetId}`);
        
        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });
}

/* ============================================
   4. NAVIGATION HIGHLIGHT ON SCROLL
   ============================================ */

function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ============================================
   5. TYPING EFFECT FOR HEADER
   ============================================ */

function initTypingEffect() {
  const headerSubtitle = document.querySelector('header > p');
  if (!headerSubtitle) return;
  
  const originalText = headerSubtitle.textContent;
  const typingSpeed = 100; // milliseconds per character
  const deletingSpeed = 50;
  const pauseDuration = 2000;
  
  let index = 0;
  let isDeleting = false;
  
  headerSubtitle.textContent = '';
  
  function type() {
    if (!isDeleting && index < originalText.length) {
      headerSubtitle.textContent += originalText.charAt(index);
      index++;
      setTimeout(type, typingSpeed);
    } else if (!isDeleting && index === originalText.length) {
      setTimeout(() => {
        isDeleting = true;
        type();
      }, pauseDuration);
    } else if (isDeleting && index > 0) {
      headerSubtitle.textContent = originalText.substring(0, index - 1);
      index--;
      setTimeout(type, deletingSpeed);
    } else if (isDeleting && index === 0) {
      isDeleting = false;
      setTimeout(type, 500);
    }
  }
  
  // Start typing effect
  setTimeout(type, 1000);
}

/* ============================================
   6. FORM VALIDATION
   ============================================ */

function initFormValidation() {
  const form = document.querySelector('form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input, textarea, select');
  
  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      // Clear error when user starts typing
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        removeErrorMessage(this);
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name || field.id;
  let isValid = true;
  let errorMessage = '';
  
  // Required field validation
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = `${getFieldLabel(field)} is required`;
  }
  
  // Email validation
  else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Phone validation
  else if (field.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(value) || value.length < 10) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number';
    }
  }
  
  // Minimum length validation
  else if (field.hasAttribute('minlength') && value) {
    const minLength = parseInt(field.getAttribute('minlength'));
    if (value.length < minLength) {
      isValid = false;
      errorMessage = `${getFieldLabel(field)} must be at least ${minLength} characters`;
    }
  }
  
  // Maximum length validation
  else if (field.hasAttribute('maxlength') && value) {
    const maxLength = parseInt(field.getAttribute('maxlength'));
    if (value.length > maxLength) {
      isValid = false;
      errorMessage = `${getFieldLabel(field)} must be less than ${maxLength} characters`;
    }
  }
  
  // Display validation result
  if (!isValid) {
    showFieldError(field, errorMessage);
  } else {
    showFieldSuccess(field);
  }
  
  return isValid;
}

function getFieldLabel(field) {
  const label = document.querySelector(`label[for="${field.id}"]`);
  return label ? label.textContent.replace('*', '').replace(':', '').trim() : field.name;
}

function showFieldError(field, message) {
  field.classList.add('error');
  field.classList.remove('success');
  
  removeErrorMessage(field);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = '#ef4444';
  errorDiv.style.fontSize = '0.875rem';
  errorDiv.style.marginTop = '0.25rem';
  
  field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

function showFieldSuccess(field) {
  field.classList.remove('error');
  field.classList.add('success');
  removeErrorMessage(field);
}

function removeErrorMessage(field) {
  const errorMessage = field.parentNode.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

/* ============================================
   7. CONTACT FORM SUBMISSION
   ============================================ */

function initContactFormSubmit() {
  const form = document.querySelector('form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      // Simulate form submission
      submitForm(form);
    } else {
      showNotification('⚠️ Please fix the errors before submitting', 'error');
      
      // Scroll to first error
      const firstError = form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
    }
  });
}

function submitForm(form) {
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  // Show loading state
  submitButton.textContent = 'Sending...';
  submitButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Save to localStorage (in real app, send to server)
    saveFormSubmission(data);
    
    // Reset form
    form.reset();
    
    // Remove validation classes
    form.querySelectorAll('.success, .error').forEach(el => {
      el.classList.remove('success', 'error');
    });
    
    // Restore button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    
    // Show success message
    showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Log to console
    console.log('Form submitted:', data);
  }, 2000);
}

function saveFormSubmission(data) {
  const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
  submissions.push({
    ...data,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('formSubmissions', JSON.stringify(submissions));
}

/* ============================================
   8. SKILLS ANIMATION ON SCROLL
   ============================================ */

function initSkillsAnimation() {
  const skillItems = document.querySelectorAll('#skills li');
  if (skillItems.length === 0) return;
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
          entry.target.style.transition = 'all 0.6s ease-out';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  skillItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });
}

/* ============================================
   9. PROJECT FILTERS (if multiple projects)
   ============================================ */

function initProjectFilters() {
  const projects = document.querySelectorAll('#projects article');
  if (projects.length < 3) return; // Only add filters if 3+ projects
  
  // Create filter buttons
  const filterContainer = document.createElement('div');
  filterContainer.className = 'project-filters';
  filterContainer.innerHTML = `
    <button class="filter-btn active" data-filter="all">All</button>
    <button class="filter-btn" data-filter="web">Web</button>
    <button class="filter-btn" data-filter="mobile">Mobile</button>
    <button class="filter-btn" data-filter="design">Design</button>
  `;
  
  const projectsSection = document.getElementById('projects');
  const projectsHeading = projectsSection.querySelector('h2');
  projectsHeading.after(filterContainer);
  
  // Add filter functionality
  const filterButtons = filterContainer.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter projects
      projects.forEach(project => {
        if (filter === 'all' || project.dataset.category === filter) {
          project.style.display = 'block';
          setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'scale(1)';
          }, 10);
        } else {
          project.style.opacity = '0';
          project.style.transform = 'scale(0.8)';
          setTimeout(() => {
            project.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ============================================
   10. IMAGE GALLERY / LIGHTBOX
   ============================================ */

function initImageGallery() {
  const images = document.querySelectorAll('#projects img, #about img');
  
  images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      openLightbox(this.src, this.alt);
    });
  });
}

function openLightbox(src, alt) {
  // Create lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img src="${src}" alt="${alt}">
      <p class="lightbox-caption">${alt}</p>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  
  // Close lightbox
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      closeLightbox(lightbox);
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLightbox(lightbox);
    }
  });
}

function closeLightbox(lightbox) {
  lightbox.style.opacity = '0';
  setTimeout(() => {
    lightbox.remove();
    document.body.style.overflow = '';
  }, 300);
}

/* ============================================
   11. SCROLL TO TOP BUTTON
   ============================================ */

function initScrollToTop() {
  const scrollButton = document.createElement('button');
  scrollButton.id = 'scroll-to-top';
  scrollButton.className = 'scroll-to-top';
  scrollButton.innerHTML = '↑';
  scrollButton.title = 'Scroll to top';
  scrollButton.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollButton);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 500) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  scrollButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ============================================
   12. MOBILE MENU TOGGLE
   ============================================ */

function initMobileMenu() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  // Create hamburger button
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-menu';
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  hamburger.setAttribute('aria-label', 'Toggle menu');
  
  // Insert before nav
  nav.parentNode.insertBefore(hamburger, nav);
  
  // Toggle menu
  hamburger.addEventListener('click', function() {
    nav.classList.toggle('mobile-open');
    this.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking nav link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMobileMenu();
    });
  });
}

function closeMobileMenu() {
  const nav = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger-menu');
  
  if (nav) nav.classList.remove('mobile-open');
  if (hamburger) hamburger.classList.remove('active');
  document.body.classList.remove('menu-open');
}

/* ============================================
   13. THEME CUSTOMIZER
   ============================================ */

function initThemeCustomizer() {
  // Create customizer panel
  const customizer = document.createElement('div');
  customizer.className = 'theme-customizer';
  customizer.innerHTML = `
    <button class="customizer-toggle" title="Customize theme">🎨</button>
    <div class="customizer-panel">
      <h3>Customize Theme</h3>
      <div class="customizer-option">
        <label>Primary Color:</label>
        <input type="color" id="primary-color" value="#2563eb">
      </div>
      <div class="customizer-option">
        <label>Accent Color:</label>
        <input type="color" id="accent-color" value="#f59e0b">
      </div>
      <div class="customizer-option">
        <label>Font Size:</label>
        <input type="range" id="font-size" min="14" max="20" value="16">
        <span id="font-size-value">16px</span>
      </div>
      <button id="reset-theme">Reset to Default</button>
    </div>
  `;
  
  document.body.appendChild(customizer);
  
  // Toggle panel
  const toggle = customizer.querySelector('.customizer-toggle');
  const panel = customizer.querySelector('.customizer-panel');
  
  toggle.addEventListener('click', function() {
    panel.classList.toggle('open');
  });
  
  // Color pickers
  document.getElementById('primary-color').addEventListener('input', function(e) {
    document.documentElement.style.setProperty('--primary-color', e.target.value);
    localStorage.setItem('primaryColor', e.target.value);
  });
  
  document.getElementById('accent-color').addEventListener('input', function(e) {
    document.documentElement.style.setProperty('--accent-color', e.target.value);
    localStorage.setItem('accentColor', e.target.value);
  });
  
  // Font size
  document.getElementById('font-size').addEventListener('input', function(e) {
    const size = e.target.value + 'px';
    document.documentElement.style.setProperty('font-size', size);
    document.getElementById('font-size-value').textContent = size;
    localStorage.setItem('fontSize', e.target.value);
  });
  
  // Reset button
  document.getElementById('reset-theme').addEventListener('click', function() {
    localStorage.removeItem('primaryColor');
    localStorage.removeItem('accentColor');
    localStorage.removeItem('fontSize');
    location.reload();
  });
  
  // Load saved preferences
  loadThemePreferences();
}

function loadThemePreferences() {
  const primaryColor = localStorage.getItem('primaryColor');
  const accentColor = localStorage.getItem('accentColor');
  const fontSize = localStorage.getItem('fontSize');
  
  if (primaryColor) {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.getElementById('primary-color').value = primaryColor;
  }
  
  if (accentColor) {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.getElementById('accent-color').value = accentColor;
  }
  
  if (fontSize) {
    document.documentElement.style.setProperty('font-size', fontSize + 'px');
    document.getElementById('font-size').value = fontSize;
    document.getElementById('font-size-value').textContent = fontSize + 'px';
  }
}

/* ============================================
   14. NOTIFICATION SYSTEM
   ============================================ */

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

/* ============================================
   15. UTILITY FUNCTIONS
   ============================================ */

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get visitor count (simple analytics)
function trackVisitor() {
  let visits = parseInt(localStorage.getItem('visitCount') || '0');
  visits++;
  localStorage.setItem('visitCount', visits);
  localStorage.setItem('lastVisit', new Date().toISOString());
  console.log(`👋 Welcome! Visit #${visits}`);
}

// Track visitor on load
trackVisitor();

/* ============================================
   16. PERFORMANCE MONITORING
   ============================================ */

// Log page load time
window.addEventListener('load', function() {
  const loadTime = performance.now();
  console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
});

/* ============================================
   END OF JAVASCRIPT FILE
   ============================================ */
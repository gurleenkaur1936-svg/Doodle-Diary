/* ============================================================
   DOODLE DIARY — script.js
   Features:
     1. Hamburger / Mobile Navigation Toggle
     2. Active Nav Link Highlighting
     3. Scroll-to-Top Button
     4. Fade-In on Scroll (IntersectionObserver)
     5. Cart Counter + Toast Notification
     6. Newsletter Form Alert
     7. Contact Form Validation
     8. Testimonials Slider
   ============================================================ */

// ── 1. HAMBURGER MENU TOGGLE ──────────────────────────────
(function initHamburger() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });
})();


// ── 2. ACTIVE NAV LINK ────────────────────────────────────
(function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Match current page file name
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


// ── 3. SCROLL-TO-TOP BUTTON ───────────────────────────────
(function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


// ── 4. FADE-IN ON SCROLL (IntersectionObserver) ───────────
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach(el => observer.observe(el));
})();


// ── 5. CART COUNTER + TOAST NOTIFICATION ──────────────────
(function initCart() {
  let cartCount = 0;
  const cartCountEl = document.querySelector('.cart-count');
  const toast = document.querySelector('.cart-toast');
  const addToCartBtns = document.querySelectorAll('.add-to-cart');

  if (!addToCartBtns.length) return;

  // Create toast if not present
  let toastEl = toast;
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'cart-toast';
    toastEl.textContent = '🛍️ Item added to cart!';
    document.body.appendChild(toastEl);
  }

  let toastTimer;

  function showToast(productName) {
    toastEl.textContent = `🛍️ "${productName}" added to cart!`;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2500);
  }

  function bumpCartIcon() {
    if (!cartCountEl) return;
    cartCountEl.classList.remove('bump');
    // Force reflow
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bump');
    setTimeout(() => cartCountEl.classList.remove('bump'), 300);
  }

  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      // Update all cart count elements across navbar and mobile nav
      document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = cartCount;
      });
      bumpCartIcon();

      // Get product name from the button's closest card
      const card = btn.closest('.product-card');
      const productName = card ? card.querySelector('h3')?.textContent || 'Item' : 'Item';
      showToast(productName);
    });
  });
})();


// ── 6. NEWSLETTER FORM ────────────────────────────────────
(function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input?.value.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    alert('🎉 Thank you for subscribing! Welcome to the Doodle Diary family.');
    form.reset();
  });
})();


// ── 7. CONTACT FORM VALIDATION ────────────────────────────
(function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  /**
   * Validate a single field and show/hide error message.
   * @param {HTMLElement} field
   * @param {string} errorMsg
   * @param {Function} condition — returns true when INVALID
   */
  function validateField(field, condition) {
    const errEl = field.parentElement.querySelector('.error-msg');
    if (condition()) {
      field.classList.add('invalid');
      if (errEl) errEl.classList.add('show');
      return false;
    } else {
      field.classList.remove('invalid');
      if (errEl) errEl.classList.remove('show');
      return true;
    }
  }

  // Real-time validation on blur
  const fields = form.querySelectorAll('input, textarea');
  fields.forEach(field => {
    field.addEventListener('blur', () => {
      if (field.type === 'email') {
        validateField(field, () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
      } else {
        validateField(field, () => field.value.trim() === '');
      }
    });
    // Clear error on input
    field.addEventListener('input', () => {
      field.classList.remove('invalid');
      const errEl = field.parentElement.querySelector('.error-msg');
      if (errEl) errEl.classList.remove('show');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate name
    const name = form.querySelector('#name');
    if (name && !validateField(name, () => name.value.trim().length < 2)) {
      // ok
    } else if (name && name.value.trim().length < 2) {
      valid = false;
    }

    // Validate email
    const email = form.querySelector('#email');
    if (email) {
      const emailOk = validateField(email, () => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      if (!emailOk) valid = false;
    }

    // Validate phone (optional but must be numeric if provided)
    const phone = form.querySelector('#phone');
    if (phone && phone.value.trim() !== '') {
      const phoneOk = validateField(phone, () => !/^[\d\s\+\-\(\)]{7,15}$/.test(phone.value.trim()));
      if (!phoneOk) valid = false;
    }

    // Validate message
    const message = form.querySelector('#message');
    if (message) {
      const msgOk = validateField(message, () => message.value.trim().length < 10);
      if (!msgOk) valid = false;
    }

    // Validate name again
    if (name) {
      const nameOk = validateField(name, () => name.value.trim().length < 2);
      if (!nameOk) valid = false;
    }

    if (valid) {
      const successMsg = form.querySelector('.success-msg');
      if (successMsg) successMsg.classList.add('show');
      form.reset();
      setTimeout(() => {
        if (successMsg) successMsg.classList.remove('show');
      }, 6000);
    }
  });
})();


// ── 8. TESTIMONIALS SLIDER ────────────────────────────────
(function initSlider() {
  const track = document.querySelector('.slider-track');
  if (!track) return;

  const slides = track.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');

  let current = 0;
  const total = slides.length;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play every 5 seconds
  let autoplay = setInterval(() => goTo(current + 1), 5000);

  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  });

  // Set first dot active
  if (dots.length) dots[0].classList.add('active');
})();


// ── 9. PRODUCT FILTER (Products Page) ─────────────────────
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');
  if (!filterBtns.length || !productCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.classList.add('fade-in', 'visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

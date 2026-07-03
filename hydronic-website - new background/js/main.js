/* ===== NAVIGATION ===== */
const nav       = document.querySelector('.nav');
const toggle    = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.nav__mobile');

// Scroll behaviour
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger toggle
toggle?.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  mobileMenu?.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close mobile menu on link click
mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== ACTIVE NAV LINK ===== */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

/* ===== CONTACT FORM (contact.html) ===== */
const form = document.querySelector('.contact-form');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Simulate submission (replace with real endpoint / EmailJS / Formspree)
  setTimeout(() => {
    form.innerHTML = `
      <div class="form-success">
        <div class="form-success__icon">✓</div>
        <h3>Message received!</h3>
        <p>Thank you for getting in touch. We'll respond within one business day.</p>
      </div>`;
  }, 1200);
});

/* ===== PLAN BACKGROUND — frozen in place via CSS (#cad-bg-img transform) ===== */

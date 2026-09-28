/* ===== COOKIE CONSENT ===== */
(function () {
  var STORAGE_KEY = 'hd_cookie_consent';
  var choice = localStorage.getItem(STORAGE_KEY);

  function applyConsent(granted) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
        // Ad measurement only: lets Google Ads count enquiries from ad clicks.
        // ad_personalization stays denied: no remarketing or ad targeting.
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: 'denied'
      });
    }
  }

  // If already decided, apply immediately and stop
  if (choice === 'accepted') { applyConsent(true); return; }
  if (choice === 'declined') { applyConsent(false); return; }

  // First visit — build and show the banner
  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML =
    '<div id="cookie-banner__inner">' +
      '<p id="cookie-banner__text">We use cookies to understand how visitors use this site and to measure which of our Google ads lead to enquiries. We don\'t use cookies to show you ads or track you across other sites. ' +
        '<a href="https://ico.org.uk/your-data-matters/online/cookies/" target="_blank" rel="noopener noreferrer">Learn more</a>' +
      '</p>' +
      '<div id="cookie-banner__btns">' +
        '<button id="cookie-accept" class="cookie-btn cookie-btn--accept">Accept cookies</button>' +
        '<button id="cookie-decline" class="cookie-btn cookie-btn--decline">Decline</button>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#152A52;border-top:1px solid rgba(34,211,238,0.25);padding:1rem 1.5rem;box-shadow:0 -4px 24px rgba(0,0,0,0.35);}' +
    '#cookie-banner__inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;}' +
    '#cookie-banner__text{flex:1;font-size:0.85rem;color:#A8C0D6;margin:0;line-height:1.6;}' +
    '#cookie-banner__text a{color:#22D3EE;text-underline-offset:3px;}' +
    '#cookie-banner__btns{display:flex;gap:0.75rem;flex-shrink:0;}' +
    '.cookie-btn{padding:0.5rem 1.25rem;border-radius:6px;border:none;font-size:0.85rem;font-weight:600;cursor:pointer;transition:opacity 0.2s;}' +
    '.cookie-btn--accept{background:#22D3EE;color:#0F1E3A;}' +
    '.cookie-btn--decline{background:transparent;color:#A8C0D6;border:1px solid rgba(168,192,214,0.35);}' +
    '.cookie-btn:hover{opacity:0.85;}' +
    '@media(max-width:600px){#cookie-banner__inner{flex-direction:column;align-items:flex-start;gap:0.85rem;}#cookie-banner__btns{width:100%;}#cookie-banner__btns .cookie-btn{flex:1;text-align:center;}}';

  document.head.appendChild(style);

  function dismiss(accepted) {
    localStorage.setItem(STORAGE_KEY, accepted ? 'accepted' : 'declined');
    applyConsent(accepted);
    banner.style.transition = 'opacity 0.3s';
    banner.style.opacity = '0';
    setTimeout(function () { banner.remove(); }, 320);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(banner);
    document.getElementById('cookie-accept').addEventListener('click', function () { dismiss(true); });
    document.getElementById('cookie-decline').addEventListener('click', function () { dismiss(false); });
  });
})();

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

/* ===== CLICK-TO-CALL / EMAIL TRACKING ===== */
// Records phone and email link clicks as GA4 events so they can be marked
// as key events in GA4 and imported into Google Ads as conversions.
document.addEventListener('click', function (e) {
  var link = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
  if (!link || typeof gtag !== 'function') return;
  var isPhone = link.getAttribute('href').indexOf('tel:') === 0;
  gtag('event', isPhone ? 'phone_click' : 'email_click', {
    link_location: window.location.pathname
  });
});

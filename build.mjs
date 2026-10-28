/**
 * Afaz Explains homepage compiler.
 * Zero third-party packages. Cloudflare Pages runs: node build.mjs
 * Pages CMS edits content/homepage.json, and this script turns it into fast,
 * search-friendly static HTML on every GitHub commit.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const contentPath = path.join(ROOT, 'content', 'homepage.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
const destination = path.join(ROOT, 'dist');
fs.rmSync(destination, {recursive: true, force: true});
fs.cpSync(path.join(ROOT, 'public'), destination, {recursive: true});

const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const str = (obj, prop) => esc(obj?.[prop]);
const text = value => esc(value).replace(/\n/g, '<br>');
function url(raw, fallback = '#contact') {
  const trimmed = String(raw ?? '').trim();
  if (trimmed.startsWith('/media/')) return esc(trimmed);
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) return esc(trimmed);
  if (/^#[A-Za-z0-9_-]+$/.test(trimmed)) return trimmed;
  return fallback;
}
const hrefForBooking = url(content.contact?.booking_url, '#contact');
const hasBooking = /^https?:\/\//.test(content.contact?.booking_url || '');
const email = String(content.contact?.email || '').trim();
const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const emailHref = hasEmail ? `mailto:${encodeURIComponent(email).replace('%40', '@')}` : '#contact';
const phone = String(content.contact?.phone || '').trim();
const hasPhone = phone.length > 5;
const phoneHref = hasPhone ? `tel:${esc(phone.replace(/[^0-9+]/g, ''))}` : '#contact';
const externalProps = hasBooking ? ' target="_blank" rel="noopener noreferrer"' : '';
const icons = {
  people: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 6a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5"/>',
  document: '<path d="M6 2h8l5 5v15H6zM14 2v6h5M9 12h7M9 16h7M9 19h4"/>',
  search: '<circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5.5 5.5"/>',
  scale: '<path d="M12 3v18M7 21h10M4 8h16M6.5 8 3 16h7zm11 0L14 16h7z"/>',
  shield: '<path d="m12 2 8 3v6c0 6-4 9-8 11-4-2-8-5-8-11V5zM8.5 12.1 11 14.5l4.7-5"/>',
  chat: '<path d="M20 11a8 8 0 0 1-8 8 9 9 0 0 1-4-.9L3 21l2-5A8 8 0 1 1 20 11z"/>',
  arrow: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
  arrowdiag: '<path d="M5 18 19 4m-12 0h12v12"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h18"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  quote: '<path d="M10 10c-3 0-5 2-5 5v3h7v-7H8m10-1c-3 0-5 2-5 5v3h7v-7h-4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>'
};
function icon(key, extraClass = '') {
  return `<svg class="icon ${extraClass}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[key] || icons.document}</svg>`;
}
const defaultNavigation = [
  { label: 'The Approach', href: '#approach' },
  { label: 'The Services', href: '#services' },
  { label: 'The Journey', href: '/journey/' },
  { label: 'How to Contact', href: '#contact' }
];
const navigation = Array.isArray(content.navigation) ? content.navigation : defaultNavigation;
function navLink(item) {
  const label = String(item?.label ?? '').trim();
  const target = String(item?.href ?? '').trim();
  const allowed = /^#[A-Za-z0-9_-]+$/.test(target) || (target.startsWith('/') && !target.startsWith('//') && !/\s/.test(target));
  return label ? `<a href="${esc(allowed ? target : '#contact')}">${esc(label)}</a>` : '';
}
const desktopNavigation = navigation.map(navLink).join('\n        ');
const mobileNavigation = navigation.map(navLink).join('');
const serviceMarkup = (content.services.cards || []).map((card, index) => `
  <article class="service-card" style="--card-order:${index}">
    <div class="service-icon" aria-hidden="true">${icon(card.icon)}</div>
    <h3>${str(card,'title')}</h3>
    <p>${text(card.description)}</p>
    <a class="service-link" href="#contact" aria-label="${str(card,'link_label') || `Ask about ${str(card,'title')}`}">Discuss this service ${icon('arrow')}</a>
  </article>`).join('\n');
const highlightsMarkup = (content.highlights || []).map(item => `
  <article class="highlight">
    <span class="highlight-icon">${icon(item.icon)}</span>
    <div><h3>${str(item,'title')}</h3><p>${text(item.description)}</p></div>
  </article>`).join('');
const aboutPoints = [content.about.point_one,content.about.point_two,content.about.point_three]
  .filter(Boolean).map(point => `<li>${icon('check')} <span>${esc(point)}</span></li>`).join('');

const offerPrice = String(content.hero?.offer_price ?? '').trim().replace(/^From\b/i, 'from');
const bookingCta = `<a class="button button-gold" href="#services">${str(content.hero,'primary_button')}${icon('arrow')}</a>`;
const bookingButtonSmall = `<a class="button button-gold button-small" href="${hrefForBooking}"${externalProps}>${str(content.contact,'primary_button')}${icon('arrow')}</a>`;
const activeContactLinks = `${hasBooking ? bookingButtonSmall : ''}${hasEmail ? `<a class="button button-outline-dark button-small" href="${emailHref}">${icon('mail')}${str(content.contact,'email_button')}</a>` : ''}${hasPhone ? `<a class="phone-link" href="${phoneHref}">${esc(phone)}</a>` : ''}`;
const contactMarkup = activeContactLinks || `<p class="contact-notice">Online enquiries are being set up. Please check back soon.</p>`;
const year = new Date().getUTCFullYear();
const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0b2032">
<meta name="description" content="${str(content.settings,'meta_description')}">
<meta name="robots" content="${content.settings.allow_search_engines ? 'index,follow' : 'noindex,nofollow'}">
<title>${str(content.settings,'page_title')}</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script src="/site.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
<header class="site-header" id="top">
    <div class="container header-grid">
      <a class="brand" href="/" aria-label="Afaz Explains homepage">
        <span class="brand-title">${str(content.brand,'first_word')} <em>${str(content.brand,'second_word')}</em></span>
        <span class="brand-rule"></span>
        <span class="brand-tagline">${str(content.brand,'tagline')}</span>
      </a>
      <nav class="desktop-nav" aria-label="Main navigation">
        ${desktopNavigation}
      </nav>
      <div class="header-right">
        <a class="button button-gold header-book" href="${hrefForBooking}"${externalProps}>${str(content.contact,'primary_button')}${icon('arrow')}</a>
        <button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden>
      ${mobileNavigation}
      <a class="mobile-book" href="${hrefForBooking}"${externalProps}>${str(content.contact,'primary_button')}${icon('arrow')}</a>
    </nav>
  </header>
<div class="top-frame">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-photo"><img src="${url(content.hero.image, '/media/hero-consultation.webp')}" alt="${str(content.hero,'image_alt')}" fetchpriority="high" width="1224" height="722"></div>
    <div class="hero-overlay" aria-hidden="true"></div>
    <div class="container hero-layout"><div class="hero-copy">
      ${String(content.hero?.eyebrow ?? '').trim() ? `<p class="eyebrow gold-ink">${str(content.hero,'eyebrow')}</p>` : ''}
      <h1 id="hero-title">${str(content.hero,'line_one')}<br>${str(content.hero,'line_two')}</h1>
      <p class="hero-offer">Workplace consultations ${esc(offerPrice)} <span aria-hidden="true">·</span> ${str(content.hero,'offer_session_length')}</p>
      <div class="hero-actions">${bookingCta}</div>
    </div></div>
  </section>
</div>
<main id="main">
  <section id="services" class="services-section section-anchor" aria-labelledby="services-title">
    <div class="container services-layout">
      <div class="services-intro">
        <p class="eyebrow section-eyebrow">${str(content.services,'eyebrow')}</p>
        <h2 id="services-title">${str(content.services,'heading')}</h2>
        <p>${text(content.services.description)}</p>
        <a class="underlined-link" href="#contact">${str(content.services,'link_label')}${icon('arrow')}</a>
      </div>
      <div class="services-cards">${serviceMarkup}</div>
    </div>
  </section>
  <section class="highlights-section" aria-label="What you can expect">
    <div class="container highlight-grid">${highlightsMarkup}</div>
  </section>
  <section id="about" class="about-section section-anchor" aria-labelledby="about-title">
    <div class="about-photo"><img src="${url(content.about.image, '/media/about-office.webp')}" alt="${str(content.about,'image_alt')}" loading="lazy" width="1000" height="553"></div>
    <div class="about-copy">
      <p class="eyebrow section-eyebrow">${str(content.about,'eyebrow')}</p>
      <h2 id="about-title">${str(content.about,'heading')}</h2>
      <p>${text(content.about.description)}</p>
      <ul class="about-points">${aboutPoints}</ul>
      <a class="button button-gold button-small" href="#services">${str(content.about,'button_label')}${icon('arrow')}</a>
    </div>
  </section>
  <section class="statement-section section-anchor" id="approach" aria-labelledby="statement-title">
    <div class="container statement-layout">
      <div class="statement-intro"><p class="eyebrow section-eyebrow">${str(content.statement,'eyebrow')}</p><h2 id="statement-title">${str(content.statement,'heading')}</h2></div>
      <blockquote class="statement-quote"><span class="quote-mark" aria-hidden="true">“</span><div><p>${text(content.statement.quote)}</p><footer>${str(content.statement,'attribution')}</footer></div></blockquote>
    </div>
  </section>
  <section id="contact" class="contact-section section-anchor" aria-labelledby="contact-title">
    <div class="container contact-layout"><div class="contact-copy"><p class="eyebrow section-eyebrow">${str(content.contact,'eyebrow')}</p><h2 id="contact-title">${str(content.contact,'heading')}</h2><p>${text(content.contact.description)}</p></div><div class="contact-actions">${contactMarkup}</div></div>
  </section>
</main>
<footer class="site-footer">
  <div class="container footer-layout">
    <div class="footer-about"><a class="brand footer-brand" href="/"><span class="brand-title">${str(content.brand,'first_word')} <em>${str(content.brand,'second_word')}</em></span><span class="brand-rule"></span></a><p>${str(content.footer,'tagline')}</p></div>
    <nav class="footer-links" aria-label="Footer navigation"><h3>Quick links</h3><a href="#top">Home</a><a href="#services">Our Services</a><a href="#about">About</a><a href="#approach">Our Approach</a><a href="#contact">Contact</a></nav>
    <div class="footer-services"><h3>How I can help</h3>${(content.services.cards || []).slice(0,4).map(card=>`<a href="#services">${str(card,'title')}</a>`).join('')}</div>
    <div class="footer-contact"><h3>${str(content.footer,'contact_heading')}</h3><p>${str(content.footer,'contact_description')}</p>${hasEmail ? `<a class="footer-email" href="${emailHref}">${esc(email)}</a>` : `<a class="footer-email" href="#contact">Consultation enquiries</a>`}</div>
  </div>
  <div class="container copyright-line"><span>© ${year} ${str(content.footer,'legal_note')}</span><span>Built for clarity. Designed with purpose.</span></div>
</footer>
</body></html>`;
fs.writeFileSync(path.join(destination, 'index.html'), html);
console.log('Afaz Explains homepage built successfully at dist/index.html');

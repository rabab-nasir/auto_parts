/* =====================================================
   AutoParts Pro - Main Application JS
   ===================================================== */

'use strict';

/* ---- Product Data ---- */
const PRODUCTS = [
  { id: 1,  name: "Carbon Fibre Hood",         category: "Carbon Fibre",   price: 12000, rating: 4.8, reviews: 124, badge: "Hot",      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=340&fit=crop&q=80" },
  { id: 2,  name: "Plastic Welding Kit",        category: "Plastic Repair", price: 2500,  rating: 4.5, reviews: 89,  badge: "Popular",  image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=480&h=340&fit=crop&q=80" },
  { id: 3,  name: "Performance Engine Filter",  category: "Engine Parts",   price: 800,   rating: 4.7, reviews: 256, badge: "Sale",     image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=480&h=340&fit=crop&q=80" },
  { id: 4,  name: "Vented Brake Disc Set",      category: "Brake System",   price: 3000,  rating: 4.6, reviews: 178, badge: "New",      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=480&h=340&fit=crop&q=80" },
  { id: 5,  name: "Carbon Fibre Spoiler",       category: "Carbon Fibre",   price: 8500,  rating: 4.9, reviews: 67,  badge: "Premium",  image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=480&h=340&fit=crop&q=80" },
  { id: 6,  name: "Bumper Repair Adhesive",     category: "Plastic Repair", price: 1200,  rating: 4.4, reviews: 145, badge: "",         image: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?w=480&h=340&fit=crop&q=80" },
  { id: 7,  name: "Turbo Intercooler Kit",      category: "Engine Parts",   price: 15500, rating: 4.8, reviews: 43,  badge: "Hot",      image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=480&h=340&fit=crop&q=80" },
  { id: 8,  name: "Ceramic Brake Pads",         category: "Brake System",   price: 1800,  rating: 4.7, reviews: 210, badge: "",         image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=480&h=340&fit=crop&q=80" },
  { id: 9,  name: "Carbon Fibre Side Skirts",   category: "Carbon Fibre",   price: 9800,  rating: 4.6, reviews: 38,  badge: "Premium",  image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=480&h=340&fit=crop&q=80" },
  { id: 10, name: "Plastic Trim Restorer Kit",  category: "Plastic Repair", price: 650,   rating: 4.3, reviews: 312, badge: "Sale",     image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=480&h=340&fit=crop&q=80" },
  { id: 11, name: "High-Flow Air Filter",       category: "Engine Parts",   price: 1400,  rating: 4.5, reviews: 189, badge: "",         image: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=480&h=340&fit=crop&q=80" },
  { id: 12, name: "Stainless Brake Lines",      category: "Brake System",   price: 2200,  rating: 4.6, reviews: 77,  badge: "New",      image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=480&h=340&fit=crop&q=80" },
];

/* ---- Utility: Format Price ---- */
function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

/* ---- Stars HTML Generator ---- */
function starsHTML(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-alt"></i>';
    else html += '<i class="far fa-star"></i>';
  }
  return html;
}

/* ---- Product Card HTML ---- */
function productCardHTML(p) {
  return `
  <div class="col-sm-6 col-lg-4 col-xl-3 mb-4">
    <div class="product-card h-100" data-id="${p.id}">
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="product-wishlist" onclick="toggleWishlist(this, ${p.id})" title="Wishlist">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="product-body d-flex flex-column">
        <div class="product-cat-tag">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <div class="stars">${starsHTML(p.rating)}</div>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-footer mt-auto">
          <div class="price"><span class="price-sym">₹</span>${Number(p.price).toLocaleString('en-IN')}</div>
          <button class="btn-cart" onclick="addToCartById(${p.id})">
            <i class="fas fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/* ---- Add to Cart By ID ---- */
function addToCartById(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  Cart.add(product);
  showToast(`${product.name} added to cart!`, 'success');
  updateCartCount();
}

/* ---- Wishlist Toggle ---- */
const wishlist = JSON.parse(localStorage.getItem('ap_wishlist') || '[]');
function toggleWishlist(btn, id) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast('Added to wishlist!', 'info');
  } else {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast('Removed from wishlist.', 'info');
  }
  localStorage.setItem('ap_wishlist', JSON.stringify(wishlist));
}

/* ---- Toast Notifications ---- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || 'fa-bell'} toast-icon"></i><span class="toast-msg">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3500);
}

/* ---- Cart Count Update ---- */
function updateCartCount() {
  const count = Cart.getCount();
  document.querySelectorAll('.cart-count-badge').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

/* ---- Dark Mode / Light Mode ---- */
function initTheme() {
  const saved = localStorage.getItem('ap_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved === 'light' ? 'light' : '');
  updateThemeIcon(saved);
}
function toggleTheme() {
  const current = localStorage.getItem('ap_theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('ap_theme', next);
  document.documentElement.setAttribute('data-theme', next === 'light' ? 'light' : '');
  updateThemeIcon(next);
}
function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    icon.className = theme === 'light' ? 'fas fa-moon theme-icon' : 'fas fa-sun theme-icon';
  });
}

/* ---- Scroll to Top Button ---- */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Sticky Navbar ---- */
function initStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ---- Page Loader ---- */
function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
}

/* ---- AOS Init ---- */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 80, easing: 'ease-out-cubic' });
  }
}

/* ---- Newsletter Form ---- */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast('Please enter a valid email address.', 'error'); return;
    }
    showToast('You\'re subscribed! Thank you.', 'success');
    input.value = '';
  });
}

/* ---- Featured Products on Home ---- */
function renderFeaturedProducts() {
  const grid = document.getElementById('featured-products-grid');
  if (!grid) return;
  const featured = PRODUCTS.slice(0, 8);
  grid.innerHTML = featured.map(p => productCardHTML(p)).join('');
}

/* ---- Navbar Inject ---- */
function getNavbarHTML(activePage) {
  const pages = [
    { href: 'index.html',    label: 'Home' },
    { href: 'products.html', label: 'Products' },
    { href: 'about.html',    label: 'About' },
    { href: 'contact.html',  label: 'Contact' },
  ];
  const links = pages.map(p =>
    `<li class="nav-item">
      <a class="nav-link${p.label === activePage ? ' active' : ''}" href="${p.href}">${p.label}</a>
    </li>`
  ).join('');
  return `
  <nav class="navbar navbar-expand-lg sticky-top" id="main-navbar">
    <div class="container">
      <a class="navbar-brand" href="index.html">
        <div class="brand-icon"><i class="fas fa-bolt"></i></div>
        Auto<span class="brand-pro">Parts Pro</span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <i class="fas fa-bars" style="color:var(--text-muted)"></i>
      </button>
      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav mx-auto gap-1">${links}</ul>
        <div class="nav-icons">
          <button class="nav-icon-btn" onclick="toggleTheme()" title="Toggle theme">
            <i class="fas fa-sun theme-icon"></i>
          </button>
          <a href="cart.html" class="nav-icon-btn" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-badge cart-count-badge">0</span>
          </a>
          <a href="login.html" class="nav-icon-btn" title="Account">
            <i class="fas fa-user"></i>
          </a>
        </div>
      </div>
    </div>
  </nav>`;
}

/* ---- Footer Inject ---- */
function getFooterHTML() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="row gy-5">
        <div class="col-lg-4">
          <div class="footer-brand">
            <div class="brand-icon"><i class="fas fa-bolt"></i></div>
            Auto<span class="red">Parts Pro</span>
          </div>
          <p class="footer-desc">Your trusted partner for premium automotive parts. Specializing in Carbon Fibre components, Plastic Repair solutions, and high-performance Engine parts since 2010.</p>
          <div class="footer-socials">
            <a href="#" class="social-btn"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-youtube"></i></a>
            <a href="#" class="social-btn"><i class="fab fa-twitter"></i></a>
          </div>
        </div>
        <div class="col-sm-6 col-lg-2">
          <div class="footer-heading">Quick Links</div>
          <ul class="footer-links">
            <li><a href="index.html"><i class="fas fa-chevron-right fa-xs"></i> Home</a></li>
            <li><a href="products.html"><i class="fas fa-chevron-right fa-xs"></i> Products</a></li>
            <li><a href="about.html"><i class="fas fa-chevron-right fa-xs"></i> About Us</a></li>
            <li><a href="contact.html"><i class="fas fa-chevron-right fa-xs"></i> Contact</a></li>
            <li><a href="cart.html"><i class="fas fa-chevron-right fa-xs"></i> My Cart</a></li>
          </ul>
        </div>
        <div class="col-sm-6 col-lg-2">
          <div class="footer-heading">Categories</div>
          <ul class="footer-links">
            <li><a href="products.html?cat=Carbon+Fibre"><i class="fas fa-chevron-right fa-xs"></i> Carbon Fibre</a></li>
            <li><a href="products.html?cat=Plastic+Repair"><i class="fas fa-chevron-right fa-xs"></i> Plastic Repair</a></li>
            <li><a href="products.html?cat=Engine+Parts"><i class="fas fa-chevron-right fa-xs"></i> Engine Parts</a></li>
            <li><a href="products.html?cat=Brake+System"><i class="fas fa-chevron-right fa-xs"></i> Brake System</a></li>
          </ul>
        </div>
        <div class="col-lg-4">
          <div class="footer-heading">Contact Info</div>
          <div class="footer-contact-item">
            <div class="footer-contact-icon"><i class="fas fa-map-marker-alt"></i></div>
            <div class="footer-contact-text">Plot 12, Industrial Estate, Pune, Maharashtra 411026, India</div>
          </div>
          <div class="footer-contact-item">
            <div class="footer-contact-icon"><i class="fas fa-phone"></i></div>
            <div class="footer-contact-text">+91 98765 43210<br>Mon–Sat: 9 AM – 7 PM</div>
          </div>
          <div class="footer-contact-item">
            <div class="footer-contact-icon"><i class="fas fa-envelope"></i></div>
            <div class="footer-contact-text">support@autopartspro.in</div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-bottom-text">© 2024 AutoParts Pro. All rights reserved.</div>
        <div class="footer-bottom-text">Powered by passion for performance.</div>
      </div>
    </div>
  </footer>
  <button class="scroll-top" id="scroll-top-btn" title="Back to top"><i class="fas fa-chevron-up"></i></button>
  <div id="toast-container" class="toast-container"></div>`;
}

/* ---- Inject Navbar & Footer ---- */
function injectLayout(activePage) {
  const navPlaceholder = document.getElementById('navbar-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (navPlaceholder) navPlaceholder.outerHTML = getNavbarHTML(activePage);
  if (footerPlaceholder) footerPlaceholder.outerHTML = getFooterHTML();
}

/* ---- DOM Ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initAOS();
  hideLoader();
  initStickyNavbar();
  initScrollTop();
  renderFeaturedProducts();
  initNewsletter();
  updateCartCount();
});

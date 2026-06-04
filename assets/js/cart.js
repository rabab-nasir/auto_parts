/* =====================================================
   AutoParts Pro - Cart Management
   ===================================================== */

'use strict';

const Cart = (function() {
  const STORAGE_KEY = 'ap_cart';

  function getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }
  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function add(product) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + 1, 99);
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
  }

  function remove(id) {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
  }

  function updateQty(id, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, Math.min(99, qty));
      saveCart(cart);
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function getCount() {
    return getCart().reduce((sum, i) => sum + i.qty, 0);
  }

  function getSubtotal() {
    return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getShipping() {
    const sub = getSubtotal();
    return sub === 0 ? 0 : sub >= 5000 ? 0 : 299;
  }

  function getGST() {
    return Math.round(getSubtotal() * 0.18);
  }

  function getTotal() {
    return getSubtotal() + getShipping() + getGST();
  }

  return { getCart, add, remove, updateQty, clear, getCount, getSubtotal, getShipping, getGST, getTotal };
})();

/* ---- Cart Page Rendering ---- */
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const emptyMsg  = document.getElementById('cart-empty');
  const cartMain  = document.getElementById('cart-main');
  if (!container) return;

  const items = Cart.getCart();

  if (items.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (cartMain) cartMain.style.display = 'none';
    return;
  }

  if (emptyMsg) emptyMsg.style.display = 'none';
  if (cartMain) cartMain.style.display = '';

  container.innerHTML = items.map(item => `
    <div class="cart-item" id="cart-row-${item.id}">
      <div class="cart-product-info">
        <img class="cart-img" src="${item.image}" alt="${item.name}" loading="lazy">
        <div>
          <div class="cart-product-name">${item.name}</div>
          <div class="cart-product-cat">${item.category}</div>
        </div>
      </div>
      <div class="cart-price">${formatPrice(item.price)}</div>
      <div class="qty-ctrl">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)"><i class="fas fa-minus fa-xs"></i></button>
        <input class="qty-val" type="number" value="${item.qty}" min="1" max="99"
          onchange="setQty(${item.id}, this.value)" />
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="fas fa-plus fa-xs"></i></button>
      </div>
      <div class="cart-total-price">${formatPrice(item.price * item.qty)}</div>
      <button class="btn-remove" onclick="removeCartItem(${item.id})" title="Remove">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  renderSummary();
  updateCartCount();
}

function renderSummary() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summary-subtotal', formatPrice(Cart.getSubtotal()));
  set('summary-shipping', Cart.getShipping() === 0 ? 'FREE' : formatPrice(Cart.getShipping()));
  set('summary-gst', formatPrice(Cart.getGST()));
  set('summary-total', formatPrice(Cart.getTotal()));
}

function changeQty(id, delta) {
  const cart = Cart.getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  Cart.updateQty(id, item.qty + delta);
  renderCartPage();
}

function setQty(id, val) {
  Cart.updateQty(id, parseInt(val) || 1);
  renderCartPage();
}

function removeCartItem(id) {
  Cart.remove(id);
  renderCartPage();
  showToast('Item removed from cart.', 'info');
}

function clearCartAll() {
  if (confirm('Clear all items from cart?')) {
    Cart.clear();
    renderCartPage();
    showToast('Cart cleared.', 'info');
  }
}

/* ---- Mini Order Summary (checkout page) ---- */
function renderCheckoutSummary() {
  const container = document.getElementById('checkout-order-items');
  if (!container) return;
  const items = Cart.getCart();
  if (items.length === 0) { window.location.href = 'cart.html'; return; }

  container.innerHTML = items.map(i => `
    <div class="summary-line">
      <span>${i.name} <small style="color:var(--text-muted)">x${i.qty}</small></span>
      <span class="summary-val">${formatPrice(i.price * i.qty)}</span>
    </div>
  `).join('');

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('co-subtotal', formatPrice(Cart.getSubtotal()));
  set('co-shipping', Cart.getShipping() === 0 ? 'FREE' : formatPrice(Cart.getShipping()));
  set('co-gst', formatPrice(Cart.getGST()));
  set('co-total', formatPrice(Cart.getTotal()));
}

/* ---- Products Page Cart Logic ---- */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cart-items-container')) renderCartPage();
  if (document.getElementById('checkout-order-items'))  renderCheckoutSummary();
});

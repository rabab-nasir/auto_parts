/* =====================================================
   AutoParts Pro - Authentication
   ===================================================== */

'use strict';

const AUTH_KEY = 'ap_user';

/* ---- Helpers ---- */
const $ = id => document.getElementById(id);
const setError = (id, msg) => { const el = $(id); if (el) { el.textContent = msg; el.style.display = msg ? 'flex' : 'none'; } };
const clearErrors = () => document.querySelectorAll('.error-msg').forEach(e => { e.textContent = ''; e.style.display = 'none'; });

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); }
function validatePhone(phone) { return /^[6-9]\d{9}$/.test(phone.trim()); }
function validatePassword(pw) { return pw.length >= 6; }

/* ---- Tab Toggle (Login / Register) ---- */
function showTab(tab) {
  const loginForm = $('login-form');
  const regForm   = $('register-form');
  const loginTab  = $('tab-login');
  const regTab    = $('tab-register');
  clearErrors();

  if (tab === 'login') {
    loginForm.style.display = '';
    regForm.style.display   = 'none';
    loginTab.classList.add('active');
    regTab.classList.remove('active');
    $('auth-title').textContent    = 'Welcome Back';
    $('auth-subtitle').textContent = 'Sign in to your account';
  } else {
    loginForm.style.display = 'none';
    regForm.style.display   = '';
    loginTab.classList.remove('active');
    regTab.classList.add('active');
    $('auth-title').textContent    = 'Create Account';
    $('auth-subtitle').textContent = 'Join thousands of auto enthusiasts';
  }
}

/* ---- Password Visibility Toggle ---- */
function togglePw(inputId, btn) {
  const input = $(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

/* ---- Login Handler ---- */
function handleLogin(e) {
  e.preventDefault();
  clearErrors();
  const email    = $('login-email').value.trim();
  const password = $('login-password').value;
  let valid = true;

  if (!validateEmail(email)) {
    setError('login-email-err', 'Enter a valid email address.');
    valid = false;
  }
  if (!validatePassword(password)) {
    setError('login-pw-err', 'Password must be at least 6 characters.');
    valid = false;
  }
  if (!valid) return;

  // Check stored user
  const stored = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  if (stored && stored.email === email && stored.password === password) {
    localStorage.setItem('ap_logged_in', '1');
    showToast(`Welcome back, ${stored.name}!`, 'success');
    setTimeout(() => window.location.href = 'index.html', 1200);
  } else {
    setError('login-general-err', '<i class="fas fa-exclamation-circle"></i> Invalid email or password.');
    showToast('Login failed. Please try again.', 'error');
  }
}

/* ---- Register Handler ---- */
function handleRegister(e) {
  e.preventDefault();
  clearErrors();
  const name     = $('reg-name').value.trim();
  const email    = $('reg-email').value.trim();
  const phone    = $('reg-phone').value.trim();
  const password = $('reg-password').value;
  const confirm  = $('reg-confirm').value;
  let valid = true;

  if (name.length < 2) {
    setError('reg-name-err', 'Please enter your full name.');
    valid = false;
  }
  if (!validateEmail(email)) {
    setError('reg-email-err', 'Enter a valid email address.');
    valid = false;
  }
  if (phone && !validatePhone(phone)) {
    setError('reg-phone-err', 'Enter a valid 10-digit Indian mobile number.');
    valid = false;
  }
  if (!validatePassword(password)) {
    setError('reg-pw-err', 'Password must be at least 6 characters.');
    valid = false;
  }
  if (password !== confirm) {
    setError('reg-confirm-err', 'Passwords do not match.');
    valid = false;
  }
  if (!valid) return;

  const user = { name, email, phone, password };
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem('ap_logged_in', '1');
  showToast(`Account created! Welcome, ${name}!`, 'success');
  setTimeout(() => window.location.href = 'index.html', 1200);
}

/* ---- Logout ---- */
function logout() {
  localStorage.removeItem('ap_logged_in');
  showToast('Logged out successfully.', 'info');
  setTimeout(() => window.location.href = 'login.html', 1000);
}

/* ---- Check Auth Status ---- */
function isLoggedIn() {
  return localStorage.getItem('ap_logged_in') === '1';
}

function updateNavAuth() {
  const user = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  const loggedIn = isLoggedIn();
  const userIcon = document.querySelector('.nav-icon-btn[href="login.html"]');
  if (userIcon && loggedIn && user) {
    userIcon.title = `${user.name} (Logout)`;
    userIcon.addEventListener('click', e => { e.preventDefault(); logout(); });
    userIcon.innerHTML = `<i class="fas fa-user-check"></i>`;
  }
}

/* ---- DOM Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Bind login form
  const loginForm = $('login-form');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Bind register form
  const regForm = $('register-form');
  if (regForm) regForm.addEventListener('submit', handleRegister);

  // Update nav auth state
  updateNavAuth();
});

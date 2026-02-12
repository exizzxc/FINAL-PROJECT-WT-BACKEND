import { Auth } from "./auth.js";

const CART_KEY = "cart";
const FAV_KEY = "favorites";

function getCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);
  } catch {
    return 0;
  }
}

function getFavCount() {
  try {
    const fav = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
    return Array.isArray(fav) ? fav.length : 0;
  } catch {
    return 0;
  }
}

export function initNavbar() {

  // badges
  document.querySelectorAll(".cart-badge")
    .forEach(b => b.textContent = String(getCartCount()));

  document.querySelectorAll(".fav-badge")
    .forEach(b => b.textContent = String(getFavCount()));

  const loginLink = document.querySelector("[data-nav-login]");
  const profileWrapper = document.querySelector("[data-nav-profile-wrapper]");
  const profileBtn = document.querySelector("[data-nav-profile]");
  const emailSpan = document.querySelector(".profile-email");
  const logoutBtn = document.querySelector("[data-nav-logout]");
  const adminLink = document.querySelector("[data-nav-admin]");

  const user = Auth.getUserFromToken();

  if (user) {
    if (loginLink) loginLink.classList.add("d-none");
    if (profileWrapper) profileWrapper.classList.remove("d-none");
    if (emailSpan) emailSpan.textContent = user.email;
  } else {
    if (loginLink) loginLink.classList.remove("d-none");
    if (profileWrapper) profileWrapper.classList.add("d-none");
  }

  if (adminLink) {
    if (Auth.isAdmin()) adminLink.classList.remove("d-none");
    else adminLink.classList.add("d-none");
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      Auth.logout();
      window.location.href = "index.html";
    });
  }
}
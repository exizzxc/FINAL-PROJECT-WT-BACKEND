const CART_KEY = "cart";

const API_PRODUCTS = "/api/products";
const API_CATEGORIES = "/api/categories";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();

  if (window.initNavbar) {
    window.initNavbar();   
  }
}

function updateCartCount() {
  const total = getCart().reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
  document.querySelectorAll(".cart-badge").forEach((badge) => {
    badge.textContent = String(total);
  });
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === item.id);

  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });

  saveCart(cart);
}

async function apiFetch(url) {
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  let data = null;

  try { data = await res.json(); } catch (_) { data = null; }

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

let allProducts = [];
let allCategories = [];

function normalizeProduct(p) {
  const catId = p.categoryId?._id || p.categoryId || null;
  const catName = p.categoryId?.name || "No category";

  return {
    id: p._id,
    name: p.name ?? "Untitled",
    price: Number(p.price ?? 0),
    imageUrl: p.imageUrl || "/images/placeholder.png",
    categoryId: catId,
    categoryName: catName,
    createdAt: p.createdAt || null
  };
}

function setStatus(text) {
  const el = document.getElementById("statusText");
  if (el) el.textContent = text || "";
}

function showError(message) {
  const err = document.getElementById("errorState");
  if (!err) return;
  err.textContent = message;
  err.classList.remove("d-none");
}

function clearError() {
  const err = document.getElementById("errorState");
  if (!err) return;
  err.classList.add("d-none");
  err.textContent = "";
}

function renderCategories() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;

  const current = select.value || "All";
  select.innerHTML = `<option value="All">All</option>`;

  allCategories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c._id;
    opt.textContent = c.name;
    select.appendChild(opt);
  });

  if ([...select.options].some((o) => o.value === current)) {
    select.value = current;
  } else {
    select.value = "All";
  }
}

function productCardHTML(p) {
  const safeName = escapeHtml(p.name);
  const safeCat = escapeHtml(p.categoryName);

  return `
    <div class="product-card" onclick="window.location.href='product.html?id=${p.id}'"
     data-id="${p.id}" data-name="${safeName}" data-price="${p.price}" data-img="${p.imageUrl}">
      <img class="product-media" src="${p.imageUrl}" alt="${safeName}"
           onerror="this.src='/images/placeholder.png'">
      <div class="product-body">
        <h3 class="product-title">${safeName}</h3>
        <div class="product-meta">
          <div class="product-cat"><i class="bi bi-tag me-1"></i>${safeCat}</div>
          <div class="product-price">₸ ${formatPrice(p.price)}</div>
        </div>

        <div class="product-actions d-flex gap-2">

          <button class="btn btn-outline-danger fav-btn" data-id="${p.id}" type="button">
            <i class="bi ${window.Favorites && Favorites.isFavorite(p.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}"></i>
          </button>

          <button class="btn btn-dark btn-add add-to-cart" type="button">
            <i class="bi bi-cart-plus me-1"></i> Add
          </button>

        </div>

      </div>
    </div>
  `;
}

function renderProducts(list) {
  const container = document.getElementById("catalogContainer");
  const empty = document.getElementById("emptyState");
  if (!container || !empty) return;

  if (!list.length) {
    container.innerHTML = "";
    empty.classList.remove("d-none");
    return;
  }

  empty.classList.add("d-none");
  container.innerHTML = list.map(productCardHTML).join("");
}

function applyFilters() {
  const categoryId = document.getElementById("categoryFilter")?.value || "All";
  const q = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  const min = Number(document.getElementById("priceMin")?.value || 0);
  const maxRaw = document.getElementById("priceMax")?.value;
  const max = maxRaw === "" || maxRaw == null ? Number.POSITIVE_INFINITY : Number(maxRaw);

  const sort = document.getElementById("sortSelect")?.value || "newest";

  let filtered = allProducts.slice();

  if (categoryId !== "All") {
    filtered = filtered.filter((p) => p.categoryId === categoryId);
  }

  if (q) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(q));
  }

  filtered = filtered.filter((p) => p.price >= min && p.price <= max);

  filtered = sortProducts(filtered, sort);

  setStatus(`${filtered.length} item(s)`);
  renderProducts(filtered);
}

function sortProducts(list, mode) {
  const arr = list.slice();

  if (mode === "priceAsc") arr.sort((a, b) => a.price - b.price);
  else if (mode === "priceDesc") arr.sort((a, b) => b.price - a.price);
  else if (mode === "nameAsc") arr.sort((a, b) => a.name.localeCompare(b.name));
  else {
    arr.sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }

  return arr;
}

function resetFilters() {
  const category = document.getElementById("categoryFilter");
  const search = document.getElementById("searchInput");
  const min = document.getElementById("priceMin");
  const max = document.getElementById("priceMax");
  const sort = document.getElementById("sortSelect");

  if (category) category.value = "All";
  if (search) search.value = "";
  if (min) min.value = "";
  if (max) max.value = "";
  if (sort) sort.value = "newest";

  applyFilters();
}

function formatPrice(n) {
  const num = Number(n || 0);
  return num.toLocaleString("ru-RU");
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("click", function (e) {
  const favBtn = e.target.closest(".fav-btn");
  if (!favBtn) return;

  const id = favBtn.dataset.id;

  if (!window.Favorites) return;

  Favorites.toggleFavorite(id);

  const icon = favBtn.querySelector("i");

  if (Favorites.isFavorite(id)) {
    icon.classList.remove("bi-heart");
    icon.classList.add("bi-heart-fill", "text-danger");
  } else {
    icon.classList.remove("bi-heart-fill", "text-danger");
    icon.classList.add("bi-heart");
  }
});



document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount();
  if (window.Favorites) {
  }

  clearError();
  setStatus("Loading...");

  if (!document.getElementById("catalogContainer")) return;

  try {
    const [cats, prods] = await Promise.all([
      apiFetch(API_CATEGORIES).catch(() => []),
      apiFetch(API_PRODUCTS)
    ]);

    allCategories = Array.isArray(cats) ? cats : [];
    allProducts = Array.isArray(prods) ? prods.map(normalizeProduct) : [];

    renderCategories();
    applyFilters();
    setStatus(`${allProducts.length} item(s)`);
  } catch (e) {
    setStatus("");
    showError(`Failed to load catalog: ${e.message}`);
  }

  document.getElementById("categoryFilter")?.addEventListener("change", applyFilters);
  document.getElementById("searchInput")?.addEventListener("input", applyFilters);
  document.getElementById("priceMin")?.addEventListener("input", applyFilters);
  document.getElementById("priceMax")?.addEventListener("input", applyFilters);
  document.getElementById("sortSelect")?.addEventListener("change", applyFilters);
  document.getElementById("btnResetFilters")?.addEventListener("click", resetFilters);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    const card = btn.closest(".product-card");
    if (!card) return;

    addToCart({
      id: card.dataset.id,
      title: card.dataset.name,
      price: Number(card.dataset.price),
      img: card.dataset.img
    });
  });
});

const API = "/api";
const TOKEN_KEY = "adminToken";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function logout() {
  localStorage.removeItem("adminToken");   // удалить правильный ключ
  localStorage.removeItem("token");        // если вдруг есть обычный
  window.location.replace("admin-login.html"); // жесткий редирект
}

function showStatus(msg, type = "success") {
  const box = document.getElementById("statusBox");
  box.className = `alert alert-${type}`;
  box.textContent = msg;
  box.classList.remove("d-none");
  setTimeout(() => box.classList.add("d-none"), 3000);
}

let products = [];
let categories = [];
let editingProductId = null;

// ------------------- LOAD DATA -------------------

async function loadAll() {
  categories = await apiFetch("/categories");
  products = await apiFetch("/products");
  renderCategories();
  renderProducts();
  renderCategoryDropdown();
}

// ------------------- CATEGORIES -------------------

function renderCategories() {
  const root = document.getElementById("categoriesList");
  if (!root) return;

  root.innerHTML = categories.map(c => `
    <div class="border rounded p-2 mb-2 d-flex justify-content-between">
      <div>
        <strong>${c.name}</strong>
        <div class="small text-muted">${c.description || ""}</div>
      </div>
      <div>
        <button class="btn btn-sm btn-warning"
          onclick="editCategory('${c._id}')">Edit</button>
        <button class="btn btn-sm btn-danger"
          onclick="deleteCategory('${c._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

async function addCategory() {
  const name = document.getElementById("catName").value;
  const description = document.getElementById("catDesc").value;

  if (!name) return showStatus("Category name required", "danger");

  await apiFetch("/categories", {
    method: "POST",
    body: JSON.stringify({ name, description })
  });

  document.getElementById("catName").value = "";
  document.getElementById("catDesc").value = "";
  await loadAll();
  showStatus("Category added");
}

function editCategory(id) {
  const cat = categories.find(c => c._id === id);
  if (!cat) return;

  document.getElementById("editCatId").value = cat._id;
  document.getElementById("editCatName").value = cat.name;
  document.getElementById("editCatDesc").value = cat.description || "";
}

async function deleteCategory(id) {
  if (!confirm("Delete category?")) return;

  await apiFetch(`/categories/${id}`, { method: "DELETE" });
  await loadAll();
  showStatus("Category deleted");
}

function renderCategoryDropdown() {
  const sel = document.getElementById("prodCategory");
  if (!sel) return;

  sel.innerHTML =
    `<option value="">No category</option>` +
    categories.map(c =>
      `<option value="${c._id}">${c.name}</option>`
    ).join("");
}

// ------------------- PRODUCTS -------------------

function renderProducts() {
  const root = document.getElementById("productsList");

  root.innerHTML = products.map(p => {
    const catName = categories.find(c => c._id === (p.categoryId?._id || p.categoryId))?.name || "No category";

    return `
    <div class="border rounded p-3 mb-3">
      <div class="d-flex gap-3">

        <img src="${p.imageUrl || 'https://via.placeholder.com/120'}"
             width="120"
             style="object-fit:cover;border-radius:8px">

        <div class="flex-grow-1">
          <h6>${p.name}</h6>
          <div>₸ ${p.price}</div>
          <div class="small text-muted">${p.description || ""}</div>
          <div class="small text-muted">Category: ${catName}</div>
        </div>

        <div class="d-flex flex-column gap-2">
          <button class="btn btn-sm btn-warning"
            onclick="startEditProduct('${p._id}')">
            Edit
          </button>
          <button class="btn btn-sm btn-danger"
            onclick="deleteProduct('${p._id}')">
            Delete
          </button>
        </div>

      </div>
    </div>
    `;
  }).join("");
}

async function addOrUpdateProduct() {
  const name = document.getElementById("prodName").value;
  const price = Number(document.getElementById("prodPrice").value);
  const description = document.getElementById("prodDesc").value;
  const imageUrl = document.getElementById("prodImage").value;
  const categoryId = document.getElementById("prodCategory").value || null;

  if (!name || Number.isNaN(price))
    return showStatus("Name and price required", "danger");

  if (editingProductId) {
    await apiFetch(`/products/${editingProductId}`, {
      method: "PUT",
      body: JSON.stringify({ name, price, description, imageUrl, categoryId })
    });

    editingProductId = null;
    showStatus("Product updated");
  } else {
    await apiFetch("/products", {
      method: "POST",
      body: JSON.stringify({ name, price, description, imageUrl, categoryId })
    });

    showStatus("Product added");
  }

  document.getElementById("prodName").value = "";
  document.getElementById("prodPrice").value = "";
  document.getElementById("prodDesc").value = "";
  document.getElementById("prodImage").value = "";

  await loadAll();
}

function startEditProduct(id) {
  const p = products.find(x => x._id === id);
  editingProductId = id;

  document.getElementById("prodName").value = p.name;
  document.getElementById("prodPrice").value = p.price;
  document.getElementById("prodDesc").value = p.description;
  document.getElementById("prodImage").value = p.imageUrl || "";
  document.getElementById("prodCategory").value =
    p.categoryId?._id || p.categoryId || "";
}

async function deleteProduct(id) {
  if (!confirm("Delete product?")) return;

  await apiFetch(`/products/${id}`, { method: "DELETE" });
  await loadAll();
  showStatus("Product deleted");
}

// ------------------- INIT -------------------

document.addEventListener("DOMContentLoaded", async () => {

  const logoutBtn = document.getElementById("btnLogout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  const addProductBtn = document.getElementById("btnAddProduct");
  if (addProductBtn) {
    addProductBtn.addEventListener("click", addOrUpdateProduct);
  }

  const catBtn = document.getElementById("btnAddCategory");
  if (catBtn) {
    catBtn.addEventListener("click", addCategory);
  }

  await loadAll();
});
const CART_KEY = "fernwood-cart"; // [{ id, qty }]
const WISHLIST_KEY = "fernwood-wishlist"; // [id, id, ...]
const RECENTLY_VIEWED_KEY = "fernwood-recently-viewed"; // [id, id, ...] most recent first

// ---------- Storage helpers ----------

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateNavBadges();
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  updateNavBadges();
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.id !== id));
}

function setCartQty(id, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(id);
    return;
  }
  item.qty = qty;
  saveCart(cart);
}

function toggleWishlist(id) {
  const list = getWishlist();
  const index = list.indexOf(id);
  if (index === -1) {
    list.push(id);
  } else {
    list.splice(index, 1);
  }
  saveWishlist(list);
}

function isWishlisted(id) {
  return getWishlist().includes(id);
}

// ---------- Recently viewed ----------

function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch {
    return [];
  }
}

function recordRecentlyViewed(id) {
  let ids = getRecentlyViewed().filter((existingId) => existingId !== id);
  ids.unshift(id); // most recent goes first
  ids = ids.slice(0, 8); // keep only the last 8
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids));
}

function renderRecentlyViewed(containerId, excludeId = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const ids = getRecentlyViewed().filter((id) => id !== excludeId);
  const products = ids.map(getProductById).filter(Boolean).slice(0, 4);

  const section = container.closest(".section") || container;

  if (products.length === 0) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  container.innerHTML = products.map(productCardHTML).join("");
  attachCardListeners(container);
}

// ---------- Small helpers ----------

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function formatPrice(value) {
  return `\u20b9${value.toLocaleString("en-IN")}`;
}

function truncateText(text, maxLength = 70) {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + "…";
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function heartIcon() {
  return `<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
  </svg>`;
}

// ---------- Nav badges (runs on every page) ----------

function updateNavBadges() {
  const cartCount = getCart().reduce((sum, item) => sum + item.qty, 0);
  const wishCount = getWishlist().length;

  const cartBadge = document.getElementById("cartBadge");
  const wishBadge = document.getElementById("wishBadge");

  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.hidden = cartCount === 0;
  }
  if (wishBadge) {
    wishBadge.textContent = wishCount;
    wishBadge.hidden = wishCount === 0;
  }
}

// ---------- Reusable product card ----------

function productCardHTML(product) {
  const wished = isWishlisted(product.id);
  return `
    <div class="card" data-id="${product.id}">
      <a href="product.html?id=${product.id}" class="card__image-wrap">
        ${product.tag ? `<span class="card__tag">${product.tag}</span>` : ""}
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </a>
      <button class="card__wish ${wished ? "active" : ""}" data-wish="${product.id}" aria-label="Toggle wishlist">
        ${heartIcon()}
      </button>
      <div class="card__body">
        <span class="card__category">${product.category}</span>
        <a href="product.html?id=${product.id}"><h3 class="card__name">${product.name}</h3></a>
        ${product.description ? `<p class="card__notes">${truncateText(product.description, 70)}</p>` : ""}
        <span class="card__price">${formatPrice(product.price)}</span>
        <button class="card__add" data-add="${product.id}">Add to cart</button>
      </div>
    </div>
  `;
}

function attachCardListeners(container) {
  container.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(btn.dataset.add, 1);
      btn.textContent = "Added \u2713";
      setTimeout(() => (btn.textContent = "Add to cart"), 1200);
    });
  });

  container.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleWishlist(btn.dataset.wish);
      btn.classList.toggle("active");
    });
  });
}

// ============================================================
// Page renderers
// ============================================================

function renderHome() {
  const featured = PRODUCTS.filter((p) => p.tag).slice(0, 4);
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  grid.innerHTML = featured.map(productCardHTML).join("");
  attachCardListeners(grid);

  renderRecentlyViewed("recentlyViewedGrid");
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  const searchInput = document.getElementById("searchInput");
  const sortSelect = document.getElementById("sortSelect");
  const pillsContainer = document.getElementById("categoryPills");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;

  let activeCategory = getQueryParam("category") || "All";

  // Build category pills
  const allCategories = ["All", ...CATEGORIES];
  pillsContainer.innerHTML = allCategories
    .map(
      (cat) =>
        `<button class="pill ${cat === activeCategory ? "active" : ""}" data-category="${cat}">${cat}</button>`
    )
    .join("");

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const sortBy = sortSelect.value;

    let results = PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesQuery = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === "price-asc") results.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") results.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc") results.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = results.map(productCardHTML).join("");
    emptyState.hidden = results.length > 0;
    attachCardListeners(grid);
  }

  pillsContainer.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      activeCategory = pill.dataset.category;
      pillsContainer.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  applyFilters();
}

function renderProductDetail() {
  const wrap = document.getElementById("detailWrap");
  if (!wrap) return;

  const id = getQueryParam("id");
  const product = getProductById(id);

  if (!product) {
    wrap.innerHTML = `<p class="empty-state">Product not found. <a href="products.html">Back to shop</a></p>`;
    return;
  }

  let qty = 1;

  function draw() {
    const wished = isWishlisted(product.id);
    wrap.innerHTML = `
      <div class="detail__image"><img src="${product.image}" alt="${product.name}" /></div>
      <div class="detail__info">
        <span class="detail__category">${product.category}</span>
        <h1 class="detail__name">${product.name}</h1>
        <span class="detail__price">${formatPrice(product.price)}</span>
        <p class="detail__desc">${product.description}</p>
        <span class="detail__stock">${product.stock} in stock</span>
        <div class="detail__actions">
          <div class="qty-stepper">
            <button id="qtyMinus" aria-label="Decrease quantity">\u2212</button>
            <span id="qtyValue">${qty}</span>
            <button id="qtyPlus" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn--primary" id="addToCartBtn">Add to cart</button>
          <button class="btn btn--outline ${wished ? "active" : ""}" id="wishBtn">${wished ? "Wishlisted \u2665" : "Wishlist"}</button>
        </div>
      </div>
    `;

    document.getElementById("qtyMinus").addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      document.getElementById("qtyValue").textContent = qty;
    });
    document.getElementById("qtyPlus").addEventListener("click", () => {
      qty = Math.min(product.stock, qty + 1);
      document.getElementById("qtyValue").textContent = qty;
    });
    document.getElementById("addToCartBtn").addEventListener("click", () => {
      addToCart(product.id, qty);
      const btn = document.getElementById("addToCartBtn");
      btn.textContent = "Added to cart \u2713";
      setTimeout(() => (btn.textContent = "Add to cart"), 1200);
    });
    document.getElementById("wishBtn").addEventListener("click", () => {
      toggleWishlist(product.id);
      draw();
    });
  }

  draw();
  document.title = `${product.name} — Fernwood`;
  recordRecentlyViewed(product.id);
  renderRecentlyViewed("recentlyViewedGrid", product.id);
}

function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  function draw() {
    const cart = getCart();
    const items = cart
      .map((entry) => ({ ...entry, product: getProductById(entry.id) }))
      .filter((entry) => entry.product);

    if (items.length === 0) {
      container.innerHTML = `<p class="empty-state">Your cart is empty. <a href="products.html">Browse the shop</a></p>`;
      document.getElementById("cartSummary").hidden = true;
      return;
    }

    document.getElementById("cartSummary").hidden = false;

    container.innerHTML = items
      .map(
        (item) => `
      <div class="line-item" data-id="${item.id}">
        <div class="line-item__image"><img src="${item.product.image}" alt="${item.product.name}" /></div>
        <div>
          <div class="line-item__name">${item.product.name}</div>
          <div class="line-item__category">${item.product.category}</div>
        </div>
        <div class="qty-stepper">
          <button data-minus="${item.id}" aria-label="Decrease quantity">\u2212</button>
          <span>${item.qty}</span>
          <button data-plus="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <span>${formatPrice(item.product.price * item.qty)}</span>
        <button class="line-item__remove" data-remove="${item.id}" aria-label="Remove item">\u2715</button>
      </div>
    `
      )
      .join("");

    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
    const shipping = subtotal > 0 ? 60 : 0;
    const total = subtotal + shipping;

    document.getElementById("subtotalValue").textContent = formatPrice(subtotal);
    document.getElementById("shippingValue").textContent = formatPrice(shipping);
    document.getElementById("totalValue").textContent = formatPrice(total);

    container.querySelectorAll("[data-plus]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const item = cart.find((i) => i.id === btn.dataset.plus);
        setCartQty(item.id, item.qty + 1);
        draw();
      })
    );
    container.querySelectorAll("[data-minus]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const item = cart.find((i) => i.id === btn.dataset.minus);
        setCartQty(item.id, item.qty - 1);
        draw();
      })
    );
    container.querySelectorAll("[data-remove]").forEach((btn) =>
      btn.addEventListener("click", () => {
        removeFromCart(btn.dataset.remove);
        draw();
      })
    );
  }

  draw();
}

function renderWishlist() {
  const grid = document.getElementById("wishlistGrid");
  if (!grid) return;

  const ids = getWishlist();
  const products = ids.map(getProductById).filter(Boolean);

  if (products.length === 0) {
    grid.innerHTML = `<p class="empty-state">Nothing saved yet. <a href="products.html">Browse the shop</a></p>`;
    return;
  }

  grid.innerHTML = products.map(productCardHTML).join("");
  attachCardListeners(grid);

  // Re-render if something gets un-wishlisted from this page
  grid.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.addEventListener("click", () => setTimeout(renderWishlist, 150));
  });
}

function renderCheckout() {
  const summary = document.getElementById("checkoutSummary");
  const form = document.getElementById("checkoutForm");
  if (!summary || !form) return;

  const cart = getCart();
  const items = cart.map((entry) => ({ ...entry, product: getProductById(entry.id) })).filter((e) => e.product);

  if (items.length === 0) {
    document.getElementById("checkoutLayout").innerHTML = `<p class="empty-state">Your cart is empty. <a href="products.html">Browse the shop</a></p>`;
    return;
  }

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const shipping = 60;
  const total = subtotal + shipping;

  summary.innerHTML =
    items
      .map(
        (i) => `<div class="order-summary-item"><span>${i.product.name} \u00d7 ${i.qty}</span><span>${formatPrice(i.product.price * i.qty)}</span></div>`
      )
      .join("") +
    `<div class="summary-row" style="margin-top:0.75rem;"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
     <div class="summary-row"><span>Shipping</span><span>${formatPrice(shipping)}</span></div>
     <div class="summary-row summary-row--total"><span>Total</span><span>${formatPrice(total)}</span></div>`;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveCart([]); // clear cart — order "placed"
    document.getElementById("checkoutLayout").hidden = true;
    document.getElementById("confirmation").hidden = false;
  });
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
  updateNavBadges();

  const page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (page === "products") renderProducts();
  if (page === "product") renderProductDetail();
  if (page === "cart") renderCart();
  if (page === "wishlist") renderWishlist();
  if (page === "checkout") renderCheckout();
});
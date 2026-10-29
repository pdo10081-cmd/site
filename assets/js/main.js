/* const products = [
  {
    id: 1,
    name: "MacBook Pro 14",
    price: 82999,
    category: "laptops",
    image: "https://placehold.co/300x200",
  },
  {
    id: 2,
    name: "iPhone 16 Pro",
    price: 41999,
    category: "smartphones",
    image: "https://placehold.co/300x200",
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 14999,
    category: "headphones",
    image: "https://placehold.co/300x200",
  },
  {
    id: 4,
    name: "Samsung Galaxy Tab S9",
    price: 33999,
    category: "tablets",
    image: "https://placehold.co/300x200",
  },
  {
    id: 5,
    name: "Logitech MX Master 3S",
    price: 4199,
    category: "accessories",
    image: "https://placehold.co/300x200",
  },
  {
    id: 6,
    name: "Apple Watch Series 10",
    price: 17999,
    category: "smartwatches",
    image: "https://placehold.co/300x200",
  },
  {
    id: 7,
    name: "Xiaomi Redmi Buds 6",
    price: 1699,
    category: "earbuds",
    image: "https://placehold.co/300x200",
  },
];
*/


// Старий масив більше не використовуємо, тому він закоментований
// const products = [ ... ];

let cart = [];
let globalStoreProducts = [];

const loader = document.getElementById("loader");
const container = document.querySelector(".products-grid");
const cartButton = document.querySelector(".btn-cart");
const cartOverlay = document.getElementById("cartOverlay");
const closeBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItemsContainer");

// ---------- Запит до сервера ----------

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=8");

    if (!response.ok) {
      throw new Error(`HTTP помилка: ${response.status}`);
    }

    const realProducts = await response.json();
    return realProducts;
  } catch (error) {
    console.error("Помилка завантаження товарів:", error.message);
    throw error;
  }
}

// ---------- Каталог ----------

async function initShop() {
  loader.classList.remove("hidden");
  container.innerHTML = "";

  try {
    const data = await fetchProducts();
    globalStoreProducts = data;
    loader.classList.add("hidden");

    container.innerHTML = data
      .map(
        (product) => `
          <article class="product-card" draggable="true" data-id="${product.id}">
            <img src="${product.image}" alt="${product.title}" draggable="false">
            <h3>${product.title}</h3>
            <p class="price">$${product.price}</p>
            <button class="btn btn-buy" data-id="${product.id}">Купити</button>
          </article>
        `,
      )
      .join("");
  } catch (error) {
    loader.classList.add("hidden");
    const errorEl = document.createElement("p");
    errorEl.className = "error";
    errorEl.textContent = `Помилка: ${error.message}`;
    container.replaceChildren(errorEl);
  }
}

container.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-buy")) {
    const productId = Number(event.target.dataset.id);
    const selectedProduct = globalStoreProducts.find((p) => p.id === productId);

    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  }
});

// ---------- Кошик ----------

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateUI();
}

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateUI() {
  const cartCounter = document.querySelector(".cart-counter");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCounter) {
    cartCounter.textContent = totalItems;
  }

  console.log("Загальна сума:", calculateTotal().toFixed(2), "$");
}

function renderCartItems() {
  const totalSumEl = document.getElementById("cartTotalSum");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Кошик порожній.</p>";
  } else {
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div>
              <h4>${item.title}</h4>
              <p>$${item.price}</p>
            </div>
            <div class="quantity-controls">
              <button class="btn-minus" data-id="${item.id}">−</button>
              <span>${item.quantity}</span>
              <button class="btn-plus" data-id="${item.id}">+</button>
            </div>
          </div>
        `,
      )
      .join("");
  }

  totalSumEl.textContent = calculateTotal().toFixed(2);
}

cartItemsContainer.addEventListener("click", (event) => {
  const id = Number(event.target.dataset.id);
  const item = cart.find((p) => p.id === id);

  if (!item) return;

  if (event.target.classList.contains("btn-plus")) {
    item.quantity += 1;
  }

  if (event.target.classList.contains("btn-minus")) {
    item.quantity -= 1;
    if (item.quantity === 0) {
      cart = cart.filter((p) => p.id !== id);
    }
  }

  renderCartItems();
  updateUI();
});

// ---------- Модалка кошика ----------

function openCartModal() {
  cartOverlay.classList.remove("hidden");
  renderCartItems();
}

function closeCartModal() {
  cartOverlay.classList.add("hidden");
}

cartButton.addEventListener("click", openCartModal);
closeBtn.addEventListener("click", closeCartModal);

cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) {
    closeCartModal();
  }
});



// ---------- Улюблене (Drag-and-Drop) ----------

const productsContainer = container;
let favorites = [];
const favoritesZone = document.getElementById("favoritesZone");

productsContainer.addEventListener("dragstart", (event) => {
  if (event.target.classList.contains("product-card")) {
    // Зберігаємо ID товару, який ми почали тягнути в спеціальний "буфер обміну" Drag-and-Drop
    event.dataTransfer.setData("text/plain", event.target.dataset.id);
    event.target.classList.add("dragging"); // Додаємо CSS-клас для напівпрозорості
  }
});

productsContainer.addEventListener("dragend", (event) => {
  if (event.target.classList.contains("product-card")) {
    event.target.classList.remove("dragging"); // Повертаємо нормальний вигляд
  }
});

favoritesZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  favoritesZone.classList.add("drag-over");
});

favoritesZone.addEventListener("dragleave", () => {
  favoritesZone.classList.remove("drag-over");
});

favoritesZone.addEventListener("drop", (event) => {
  event.preventDefault();
  favoritesZone.classList.remove("drag-over");

  const productId = Number(event.dataTransfer.getData("text/plain"));
  const product = globalStoreProducts.find((p) => p.id === productId);

  if (!product) return;
  if (favorites.some((p) => p.id === productId)) return;

  favorites.push(product);
  renderFavorites();
});

function renderFavorites() {
  favoritesZone.replaceChildren();

  const hint = document.createElement("p");
  hint.textContent = "Перетягніть сюди товари в Улюблене";
  favoritesZone.append(hint);

  favorites.forEach((product) => {
    const item = document.createElement("div");
    item.className = "fav-item";
    item.textContent = product.title;
    favoritesZone.append(item);
  });
}

initShop();
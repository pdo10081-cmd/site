const products = [
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

let cart = [];

const loader = document.getElementById("loader");
const container = document.querySelector(".products-grid");
const cartButton = document.querySelector(".btn-cart");
const cartOverlay = document.getElementById("cartOverlay");
const closeBtn = document.getElementById("closeCartBtn");

function fetchProducts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      resolve(products);

    }, 1500);
  });
}

async function initShop() {
  loader.classList.remove("hidden");
  container.innerHTML = "";

  try {

    const data = await fetchProducts();


    loader.classList.add("hidden");

    const htmlString = data
      .map(
        (product) => `
          <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} грн</p>
            <button class="btn btn-buy" data-id="${product.id}">Купити</button>
          </article>
        `,
      )
      .join("");

    container.innerHTML = htmlString;
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
    const selectedProduct = products.find((p) => p.id === productId);

    if (selectedProduct) {
      addToCart(selectedProduct);
    }
  }
});

function addToCart(product) {

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {

    cart.push({ ...product, quantity: 1 });
  }

  updateUI();
}

function openCartModal() {
  cartOverlay.classList.remove("hidden");
  renderCartItems();
}

function closeCartModal() {
  cartOverlay.classList.add("hidden");
}

cartButton.addEventListener("click", openCartModal);
closeBtn.addEventListener("click", closeCartModal);

// Закриття кліком по темному фону поза вікном
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) {
    closeCartModal();
  }
});

function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function updateUI() {
  const cartCounter = document.querySelector(".cart-counter");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCounter) {
    cartCounter.textContent = totalItems;
  }

  console.log("Поточний кошик:", cart);
  console.log("Загальна сума:", calculateTotal(), "грн");
}

document.getElementById("cartItemsContainer").addEventListener("click", (event) => {
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

function renderCartItems() {
  const itemsContainer = document.getElementById("cartItemsContainer");
  const totalSumEl = document.getElementById("cartTotalSum");

  if (cart.length === 0) {
    itemsContainer.innerHTML = "<p>Кошик порожній.</p>";
  } else {
    itemsContainer.innerHTML = cart
      .map(
        (item) => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <h4>${item.name}</h4>
              <p>${item.price} грн</p>
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

  totalSumEl.textContent = calculateTotal();
}

initShop();
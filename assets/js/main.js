const products = [
    {
        id: 1,
        name: "MacBook Pro 14",
        price: 82999,
        category: "laptops",
        image: "https://placehold.co/300x200"
    },
    {
        id: 2,
        name: "iPhone 16 Pro",
        price: 41999,
        category: "smartphones",
        image: "https://placehold.co/300x200"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 14999,
        category: "headphones",
        image: "https://placehold.co/300x200"
    },
    {
        id: 4,
        name: "Samsung Galaxy Tab S9",
        price: 33999,
        category: "tablets",
        image: "https://placehold.co/300x200"
    },
    {
        id: 5,
        name: "Logitech MX Master 3S",
        price: 4199,
        category: "accessories",
        image: "https://placehold.co/300x200"
    },
    {
        id: 6,
        name: "Apple Watch Series 10",
        price: 17999,
        category: "smartwatches",
        image: "https://placehold.co/300x200"
    },
    {
        id: 7,
        name: "Xiaomi Redmi Buds 6",
        price: 1699,
        category: "earbuds",
        image: "https://placehold.co/300x200"
    }
];

let cart = [];

const container = document.querySelector(".products-grid");
// Використовуємо .map() щоб перетворити масив об'єктів на масив HTML-рядків
const htmlString = products
    .map((product) => {
        return `
        <article class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} грн</p>
            <button class="btn btn-buy" data-id="${product.id}">Купити</button>
        </article>
    `;
    })
    .join(""); 

    container.innerHTML = htmlString;

    container.addEventListener("click", function (event) {


  if(event.target.classList.contains("btn-buy")) {
    // виведемо в консоль тестово id товару, який клікнули
    const productId = Number(event.target.dataset.id);

    // const selectedProduct = products.find(
    //   function (product) {  
    //     if(product.id === productId) {
    //       return true;


    const selectedProduct = products.find(p => p.id === productId);


    addToCart(selectedProduct);

  }

});




function addToCart(product) {
  // Перевіряємо (через метод find) чи існує вже такий товар
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    // Якщо товар вже в кошику, просто збільшуємо кількість у властивості `quantity`
    existingItem.quantity += 1;
  } else {
    // Інакше додаємо новий об'єкт у масив, встановлюючи початкову кількість = 1 (Spread оператор)
    cart.push({ ...product, quantity: 1 });
  }

  updateUI(); // Викликаємо оновлення екрану
}



function calculateTotal() {
  return cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}

function updateUI() {
  const cartCounter = document.querySelector(".cart-counter");
  // Практично так samo метод reduce для рахунку загальної кількості товарів (включаючи > 1 одного типу)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartCounter) {
    cartCounter.textContent = totalItems;
  }

  console.log("Поточний кошик:", cart);
  console.log("Загальна сума:", calculateTotal(), "грн");
}





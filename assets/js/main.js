const products = [
    {
        id: 1,
        name: "MacBook Pro 14",
        price: 1999.00,
        category: "laptops",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 2,
        name: "iPhone 16 Pro",
        price: 999.00,
        category: "smartphones",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 349.99,
        category: "headphones",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 4,
        name: "Samsung Galaxy Tab S9",
        price: 799.99,
        category: "tablets",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 5,
        name: "Logitech MX Master 3S",
        price: 99.99,
        category: "accessories",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 6,
        name: "Apple Watch Series 10",
        price: 429.00,
        category: "smartwatches",
        image: "https://via.placeholder.com/300x200"
    },
    {
        id: 7,
        name: "Xiaomi Redmi Buds 6",
        price: 39.99,
        category: "earbuds",
        image: "https://via.placeholder.com/300x200"
    }
];

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

// Вставляємо згенерований текст на сторінку
container.innerHTML = htmlString;

/* Файл із спільними скриптами для всього сайту (анімації, меню, кошик) */

// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');

    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return '';
}

// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("products.json");
    let products = await response.json();
    return products;
};

// Генеруємо HTML-код для карточки товару
function getCardHTML(product) {
    return `
    <div class="card">
        <div class="my-card" style="">
            <img class="my-card-img" src="img/${product.img}">
            <h5 class="text-my-card">${product.name}</h5>
            <p class="description-card">
            ${product.desc}
           </p>
            <p class="price-card">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-currency-hryvnia"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a2.64 2.64 0 0 1 2.562 -2h3.376a2.64 2.64 0 0 1 2.562 2a2.57 2.57 0 0 1 -1.344 2.922l-5.876 2.938a3.338 3.338 0 0 0 -1.78 3.64a3.11 3.11 0 0 0 3.05 2.5h2.888a2.64 2.64 0 0 0 2.562 -2" /><path d="M6 10h12" /><path d="M6 14h12" /></svg>
            ${product.price}
           </p>
            <button type="button" class="cart-btn" data-product='${JSON.stringify(product)}'>
            <svg class="bell" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12.5 17h-6.5v-14h-2" /><path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>
            Купити</button>
        </div>
    </div>
    `;
}

// Відображаємо товари на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }

    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
})


// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cartBtn');

// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign('cart.html');
});

// ОНОВЛЕНИЙ І ДО КІНЦЯ Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.loadCartFromCookies();
    }

    addItem(item) {
        // Використовуйте унікальний ідентифікатор, такий як ID
        if (this.items[item.id]) {
            this.items[item.id].quantity += 1;
        } else {
            this.items[item.id] = item;
            this.items[item.id].quantity = 1;
        }
        this.saveCartToCookies();
    }

    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 7}; path=/`;
    }

    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
        }
    }

    calculateTotal() {
        let total = 0;
        for (let key in this.items) {
            total += this.items[key].price * this.items[key].quantity;
        }
        return total;
    }
}

// Створення об'єкта кошика
let cart = new ShoppingCart();

function addToCart(event) {
    const productData = event.target.getAttribute('data-product');
    const product = JSON.parse(productData);

    // Переконайтеся, що кожен товар має унікальний id
    if (!product.id) {
        product.id = Math.random().toString(36).substr(2, 9); // Створюємо унікальний ідентифікатор
    }

    cart.addItem(product);
    console.log(cart);
}


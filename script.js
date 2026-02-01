console.log('JS LOADED');

const tg = window.Telegram.WebApp;
tg.ready();

// ---------- ДАННЫЕ ПРОДУКТЫ МЕНЮ ----------
const products = [
    { id: 1, name: 'Американо',
         price: 60, 
         category: 'coffee',
          description:
           'Классический чёрный кофе',
            image: 'img/americano.jpg' },
    { id: 2, name: 'Капучино', price: 65, category: 'coffee', description: 'Кофе с молочной пенкой', image: 'img/cappuccino.jpg' },
    { id: 3, name: 'Пирожок с капустой', price: 50, category: 'bakery', description: 'Домашняя выпечка', image: 'img/pie.jpg' },
    { id: 4, name: 'Маффин с черникой', price: 70, category: 'bakery', description: 'Вкусный маффин с ягодами', image: 'img/muffin.jpg' }
];

let cart = {};
let currentProduct = null;

// ---------- МОДАЛЬНОЕ ОКНО ----------
window.openProduct = function(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    document.getElementById('modalImage').src = currentProduct.image;
    document.getElementById('modalTitle').textContent = currentProduct.name;
    document.getElementById('modalDescription').textContent = currentProduct.description;
    document.getElementById('modalPrice').textContent = currentProduct.price + ' ฿';
    
    // Устанавливаем обработчики клика для кнопок в модалке
    document.getElementById('modalPlus').onclick = () => {
        addToCart(currentProduct.id);
    };

    document.getElementById('modalMinus').onclick = () => {
        removeFromCart(currentProduct.id);
    };

    // Обновляем цифру при открытии
    syncModalCount();

    document.getElementById('productModal').classList.remove('hidden');
};

window.closeModal = function() {
    document.getElementById('productModal').classList.add('hidden');
    currentProduct = null; // Сбрасываем текущий продукт при закрытии
};

// ---------- СИНХРОНИЗАЦИЯ КОЛИЧЕСТВА ----------
function syncModalCount() {
    // Если модалка открыта и в ней есть текущий продукт
    if (currentProduct) {
        const count = cart[currentProduct.id] || 0;
        const modalCountEl = document.getElementById('modalCount');
        if (modalCountEl) {
            modalCountEl.textContent = count;
        }
    }
}

// ---------- DOM ЭЛЕМЕНТЫ ----------
const menuPage = document.getElementById('menuPage');
const feedbackPage = document.getElementById('feedbackPage');
const productsContainer = document.getElementById('products');
const cartSum = document.getElementById('cartSum');
const feedbackText = document.getElementById('feedbackText');
const sendFeedbackBtn = document.getElementById('sendFeedback');

// ---------- НАВИГАЦИЯ ----------
function showPage(page) {
    menuPage.style.display = 'none';
    feedbackPage.style.display = 'none';
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('aboutPage').style.display = 'none';

    if (page === 'menu') menuPage.style.display = 'block';
    if (page === 'feedback') feedbackPage.style.display = 'flex';
    if (page === 'cart') document.getElementById('cartPage').style.display = 'block';
    if (page === 'about') document.getElementById('aboutPage').style.display = 'block';
}

document.getElementById('navCart').onclick = () => {
    showPage('cart');
    renderCartPage();
};
document.getElementById('navMenu').onclick = () => showPage('menu');
document.getElementById('navFeedback').onclick = () => showPage('feedback');
document.getElementById('navAbout').onclick = () => showPage('about');

// ---------- ЛОГИКА КОРЗИНЫ ----------
window.addToCart = function (id) {
    cart[id] = (cart[id] || 0) + 1;
    updateAll();
};

window.removeFromCart = function (id) {
    if (!cart[id]) return;
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
    updateAll();
};

// Вспомогательная функция, чтобы обновлять всё одним махом
function updateAll() {
    updateCartSum();   // Общая сумма внизу
    renderProducts();  // Список товаров на главной
    renderCartPage();  // Страница корзины (если открыта)
    syncModalCount();  // Цифра в открытой модалке
}

// ---------- РЕНДЕРИНГ ----------
function renderProductCard(product, count, mode = 'menu') {
    const priceText = mode === 'cart' ? (product.price * count) + ' ฿' : product.price + ' ฿';

    return `
        <div class="card" onclick="openProduct(${product.id})">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">${priceText}</div>
            <div class="controls">
                <button onclick="event.stopPropagation(); removeFromCart(${product.id})">−</button>
                <span>${count}</span>
                <button onclick="event.stopPropagation(); addToCart(${product.id})">+</button>
            </div>
        </div>
    `;
}

function renderProducts() {
    if (!productsContainer) return;
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const count = cart[product.id] || 0;
        productsContainer.innerHTML += renderProductCard(product, count, 'menu');
    });
}

function renderCartPage() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    for (const id in cart) {
        const product = products.find(p => p.id == id);
        if (!product) continue;
        const count = cart[id];
        total += product.price * count;
        container.innerHTML += renderProductCard(product, count, 'cart');
    }
    if (totalEl) totalEl.textContent = total + ' ฿';
}

function updateCartSum() {
    let sum = 0;
    for (const id in cart) {
        const product = products.find(p => p.id == id);
        if (product) sum += product.price * cart[id];
    }
    if (cartSum) cartSum.textContent = sum + ' ฿';
}

// ---------- ОБРАТНАЯ СВЯЗЬ ----------
sendFeedbackBtn.onclick = () => {
    const text = feedbackText.value.trim();
    if (!text) { alert('Введите текст'); return; }
    tg.sendData(JSON.stringify({ type: 'feedback', text }));
    feedbackText.value = '';
    alert('Отправлено!');
};

// ---------- СТАРТ ----------
showPage('menu');
renderProducts();
updateCartSum();

console.log('JS LOADED');

const tg = window.Telegram.WebApp;
tg.ready();

// ---------- ДАННЫЕ ----------
const products = [
    { id: 1, name: 'Американо', price: 80, category: 'coffee' },
    { id: 2, name: 'Капучино', price: 150, category: 'coffee' },
    { id: 3, name: 'Пирожок с капустой', price: 80, category: 'bakery' }
];

let cart = {};

// ---------- DOM ----------
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

    if (page === 'menu') menuPage.style.display = 'block';
    if (page === 'feedback') feedbackPage.style.display = 'flex';
}

document.getElementById('navMenu').onclick = () => showPage('menu');
document.getElementById('navFeedback').onclick = () => showPage('feedback');

// ---------- РЕНДЕР МЕНЮ ----------
function renderProducts() {
    productsContainer.innerHTML = '';

    products.forEach(p => {
        const count = cart[p.id] || 0;

        productsContainer.innerHTML += `
            <div class="card">
                <h3>${p.name}</h3>
                <div class="price">${p.price} ฿</div>

                <div class="controls">
                    <button onclick="removeFromCart(${p.id})">−</button>
                    <span>${count}</span>
                    <button onclick="addToCart(${p.id})">+</button>
                </div>
            </div>
        `;
    });
}

window.addToCart = function (id) {
    cart[id] = (cart[id] || 0) + 1;
    updateCartSum();
    renderProducts();
};

window.removeFromCart = function (id) {
    if (!cart[id]) return;
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
    updateCartSum();
    renderProducts();
};

// ---------- КОРЗИНА ----------
function updateCartSum() {
    let sum = 0;

    for (const id in cart) {
        const product = products.find(p => p.id == id);
        if (product) sum += product.price * cart[id];
    }

    cartSum.textContent = sum + ' ฿';
}

// ---------- ОБРАТНАЯ СВЯЗЬ ----------
sendFeedbackBtn.onclick = () => {
    const text = feedbackText.value.trim();
    if (!text) {
        alert('Введите текст');
        return;
    }

    tg.sendData(JSON.stringify({
        type: 'feedback',
        text
    }));

    feedbackText.value = '';
    alert('Отправлено!');
};

// ---------- СТАРТ ----------
showPage('menu');
renderProducts();
updateCartSum();

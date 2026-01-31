console.log('JS LOADED');

const tg = window.Telegram.WebApp;
tg.ready();

// ---------- ДАННЫЕ ПРОДУКТЫ МЕНЮ----------
const products = [
    {
        id: 1,
        name: 'Американо',
        price: 60,
        category: 'coffee',
        description: 'Классический чёрный кофе',
        image: 'img/americano.jpg'
    },
    {
        id: 2,
        name: 'Капучино',
        price: 65,
        category: 'coffee',
        description: 'Кофе с молочной пенкой',
        image: 'img/cappuccino.jpg'
    },
    {
        id: 3,
        name: 'Пирожок с капустой',
        price: 50,
        category: 'bakery',
        description: 'Домашняя выпечка',
        image: 'img/pie.jpg'
    },
    {
        id: 4,
        name: 'Маффин с черникой',
        price: 70,
        category: 'bakery',
        description: 'Вкусный маффин с ягодами',
        image: 'img/muffin.jpg'
    }
];


let cart = {}
// ---------- подключаем картинки в описание----------
let currentProduct = null;

window.openProduct = function(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    document.getElementById('modalImage').src = currentProduct.image;
    document.getElementById('modalTitle').textContent = currentProduct.name;
    document.getElementById('modalDescription').textContent = currentProduct.description;
    document.getElementById('modalPrice').textContent = currentProduct.price + ' ฿';
    
    document.getElementById('modalPlus').onclick = () => {
    addToCart(currentProduct.id);
    document.getElementById('modalCount').textContent =
        cart[currentProduct.id] || 0;
};

document.getElementById('modalMinus').onclick = () => {
    removeFromCart(currentProduct.id);
    document.getElementById('modalCount').textContent =
        cart[currentProduct.id] || 0;
};


    document.getElementById('modalCount').textContent =
        cart[currentProduct.id] || 0;

    document.getElementById('productModal').classList.remove('hidden');
};

window.closeModal = function() {
    document.getElementById('productModal').classList.add('hidden');
};

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
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('aboutPage').style.display = 'none';

    if (page === 'menu') menuPage.style.display = 'block';
    if (page === 'feedback') feedbackPage.style.display = 'flex';
    if (page === 'cart') document.getElementById('cartPage').style.display = 'block';
    if (page === 'about') document.getElementById('aboutPage').style.display = 'block'; // Добавлена навигация на страницу "О нас"
}
document.getElementById('navCart').onclick = () => {
    showPage('cart');
    renderCartPage();
};

document.getElementById('navMenu').onclick = () => showPage('menu');
document.getElementById('navFeedback').onclick = () => showPage('feedback');

document.getElementById('navAbout').onclick = () => showPage('about');





// ---------- РЕНДЕР МЕНЮ ----------

function renderProducts() {
    productsContainer.innerHTML = '';

    products.forEach(p => {
        const count = cart[p.id] || 0;

        productsContainer.innerHTML += `
    <div class="card" onclick="openProduct(${p.id})">
    <h3>${p.name}</h3>
    <div class="price">${p.price} ฿</div>
    <div class="controls">
        <button onclick="event.stopPropagation(); removeFromCart(${p.id})">−</button>
        <span>${count}</span>
        <button onclick="event.stopPropagation(); addToCart(${p.id})">+</button>
    </div>  
</div>
`;
    });
}

window.addToCart = function (id) {
    cart[id] = (cart[id] || 0) + 1;
    updateCartSum();
    renderProducts();
    renderCartPage();
};

window.removeFromCart = function (id) {
    if (!cart[id]) return;
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
    updateCartSum();
    renderProducts();
    renderCartPage();
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
// ---------- РЕНДЕР СТРАНИЦЫ КОРЗИНЫ ----------
function renderCartPage() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');

    container.innerHTML = '';

    let total = 0;

    for (const id in cart) {
        const product = products.find(p => p.id == id);
        const count = cart[id];

        if (!product) continue;

        const sum = product.price * count;
        total += sum;

        container.innerHTML += `
    <div class="cart-card">
        <div class="cart-card-info">
            <strong>${product.name}</strong>
            <div class="cart-price">${product.price} ฿</div>
        </div>

        <div class="cart-controls">
            <button onclick="removeFromCart(${id})">−</button>
            <span>${count}</span>
            <button onclick="addToCart(${id})">+</button>
        </div>

        <div class="cart-sum">
            ${sum} ฿
        </div>
    </div>
`;

    }

    totalEl.textContent = total + ' ฿';
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

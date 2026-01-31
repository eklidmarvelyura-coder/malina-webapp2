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
        description: 'Классический чёрный кофе'
    },
    {
        id: 2,
        name: 'Капучино',
        price: 65,
        category: 'coffee',
        description: 'Кофе с молочной пенкой'
    },
    {
        id: 3,
        name: 'Пирожок с капустой',
        price: 50,
        category: 'bakery',
        description: 'Домашняя выпечка'
    },
    {
        id: 4,
        name: 'Маффин с черникой',
        price: 70,
        category: 'bakery',
        description: 'Вкусный маффин с ягодами'
    }
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
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('aboutPage').style.display = 'none';

    if (page === 'menu') menuPage.style.display = 'block';
    if (page === 'feedback') feedbackPage.style.display = 'flex';
    if (page === 'cart') document.getElementById('cartPage').style.display = 'block';
    if (page === 'about') document.getElementById('aboutPage').style.display = 'block';
}

document.getElementById('navMenu').onclick = () => showPage('menu');
document.getElementById('navFeedback').onclick = () => showPage('feedback');
document.getElementById('navCart').onclick = () => showPage('cart');
document.getElementById('navAbout').onclick = () => showPage('about');
// ---------- Алерт вызова описания----------
window.openProduct = function(id) {
    const p = products.find(x => x.id === id);
    alert(`${p.name}\n\n${p.description}`);
};



// ---------- ОБРАБОТЧИКИ КЛИКОВ ПО КАРТОЧКАМ ----------
productsContainer.addEventListener('click', (event) => {
    const target = event.target;
    
    // 1. Проверяем нажатие на кнопку "Минус"
    if (target.classList.contains('btn-minus')) {
        const id = target.dataset.id;
        removeFromCart(id);
        return; // Прерываем выполнение, чтобы не сработал openProduct
    }

    // 2. Проверяем нажатие на кнопку "Плюс"
    if (target.classList.contains('btn-plus')) {
        const id = target.dataset.id;
        addToCart(id);
        return; // Прерываем выполнение
    }

    // 3. Если нажали не на кнопку, а на саму карточку (или её содержимое)
    const card = target.closest('.card');
    if (card) {
        const id = card.dataset.id;
        openProduct(id);
    }
});
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

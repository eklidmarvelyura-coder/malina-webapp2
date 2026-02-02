console.log('Malina Cafe Script Loaded');

const tg = window.Telegram.WebApp;
tg.ready();

// ---------- ДАННЫЕ ПРОДУКТОВ ----------
const products = [
    { id: 1, name: 'Американо', price: 60, category: 'coffee', description: 'Классический чёрный кофе', image: 'img/americano.jpg' },
    { id: 2, name: 'Капучино', price: 65, category: 'coffee', description: 'Кофе с молочной пенкой', image: 'img/cappuccino.jpg' },
    { id: 3, name: 'Пирожок с капустой', price: 50, category: 'bakery', description: 'Домашняя выпечка', image: 'img/pie.jpg' },
    { id: 4, name: 'Маффин с черникой', price: 70, category: 'bakery', description: 'Вкусный маффин с ягодами', image: 'img/muffin.jpg' }
];

let cart = {};
let currentProduct = null;

// ---------- НАВИГАЦИЯ ----------
window.showPage = function(page) {
    // Скрываем все секции
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });

    // Убираем активный класс у всех кнопок навигации
    document.querySelectorAll('.nav').forEach(nav => {
        nav.classList.remove('active');
    });

    // Показываем нужную страницу
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.style.display = 'block';
    }

    // Подсвечиваем активную кнопку в меню
    const activeBtn = document.getElementById('nav' + page.charAt(0).toUpperCase() + page.slice(1));
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Если перешли в корзину — обновляем её содержимое
    if (page === 'cart') {
        renderCartPage();
    }
};

// ---------- МОДАЛЬНОЕ ОКНО ----------
window.openProduct = function(id) {
    currentProduct = products.find(p => p.id === id);
    if (!currentProduct) return;

    const modal = document.getElementById('productModal');
    document.getElementById('modalImage').src = currentProduct.image;
    document.getElementById('modalTitle').textContent = currentProduct.name;
    document.getElementById('modalDescription').textContent = currentProduct.description;
    document.getElementById('modalPrice').textContent = currentProduct.price + ' ฿';

    syncModalCount();

    // Обработчики для кнопок внутри модалки
    document.getElementById('modalPlus').onclick = (e) => {
        e.stopPropagation();
        addToCart(currentProduct.id);
    };

    document.getElementById('modalMinus').onclick = (e) => {
        e.stopPropagation();
        removeFromCart(currentProduct.id);
    };

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10); // Для плавной анимации
};

window.closeModal = function() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 350); // Ждем завершения анимации
    currentProduct = null;
};

function syncModalCount() {
    if (currentProduct) {
        const count = cart[currentProduct.id] || 0;
        const modalCountEl = document.getElementById('modalCount');
        if (modalCountEl) modalCountEl.textContent = count;
    }
}

// ---------- ЛОГИКА КОРЗИНЫ ----------
window.addToCart = function(id) {
    cart[id] = (cart[id] || 0) + 1;
    updateAll();
};

window.removeFromCart = function(id) {
    if (!cart[id]) return;
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
    updateAll();
};

function updateAll() {
    updateCartSum();   // Сумма в сайдбаре
    renderProducts();  // Обновить карточки в меню
    renderCartPage();  // Обновить страницу корзины
    syncModalCount();  // Обновить цифру в открытой модалке
}

// ---------- РЕНДЕРИНГ ----------
function renderProductCard(product, count, mode = 'menu') {
    const priceText = mode === 'cart' ? (product.price * count) + ' ฿' : product.price + ' ฿';
    
    // В режиме корзины клик по карточке не открывает модалку, чтобы не мешать управлению
    const clickAttr = mode === 'menu' ? `onclick="openProduct(${product.id})"` : '';

    return `
        <div class="card" ${clickAttr}>
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
    const container = document.getElementById('products');
    if (!container) return;
    container.innerHTML = '';
    products.forEach(product => {
        const count = cart[product.id] || 0;
        container.innerHTML += renderProductCard(product, count, 'menu');
    });
}

function renderCartPage() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container) return;

    container.innerHTML = '';
    let total = 0;

    const items = Object.entries(cart);
    if (items.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; opacity:0.5;">Корзина пуста</div>';
    } else {
        items.forEach(([id, count]) => {
            const product = products.find(p => p.id == id);
            if (product) {
                total += product.price * count;
                container.innerHTML += renderProductCard(product, count, 'cart');
            }
        });
    }
    if (totalEl) totalEl.textContent = total + ' ฿';
}

function updateCartSum() {
    let sum = 0;
    for (const id in cart) {
        const product = products.find(p => p.id == id);
        if (product) sum += product.price * cart[id];
    }
    const cartSumEl = document.getElementById('cartSum');
    if (cartSumEl) cartSumEl.textContent = sum + ' ฿';
}

// ---------- ОБРАТНАЯ СВЯЗЬ ----------
const sendBtn = document.getElementById('sendFeedback');
if (sendBtn) {
    sendBtn.onclick = () => {
        const text = document.getElementById('feedbackText').value.trim();
        if (!text) { alert('Введите текст'); return; }
        tg.sendData(JSON.stringify({ type: 'feedback', text }));
        document.getElementById('feedbackText').value = '';
        alert('Сообщение отправлено!');
    };
}

// ---------- ИНИЦИАЛИЗАЦИЯ ----------
showPage('menu');
renderProducts();
updateCartSum();

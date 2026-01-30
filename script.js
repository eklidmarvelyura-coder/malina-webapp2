const tg = window.Telegram.WebApp;
const cart = {};
const cartCount = document.getElementById('cartCount');


tg.ready();

const products = [
    { id: 1, name: 'Американо', price: 120, category: 'coffee' },
    { id: 2, name: 'Капучино', price: 150, category: 'coffee' },
    { id: 3, name: 'Латте', price: 170, category: 'coffee' },
    { id: 4, name: 'Пирожок с капустой', price: 80, category: 'bakery' },
    { id: 5, name: 'Пирожок с вишней', price: 90, category: 'bakery' }
];



function render(category = 'all') {
    menu.innerHTML = '';

    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    filtered.forEach(p => {
        const count = cart[p.id] || 0;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${p.name}</h3>
            <div class="price">${p.price} ฿</div>

            <div class="controls">
                <button onclick="changeCount(${p.id}, -1)">−</button>
                <span>${count}</span>
                <button onclick="changeCount(${p.id}, 1)">+</button>
            </div>
        `;
        menu.appendChild(card);
    });
}

function changeCount(id, delta) {
    cart[id] = (cart[id] || 0) + delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    updateCartCount();
    render(document.querySelector('.category.active').dataset.category);
}

function updateCartCount() {
    let sum = 0;

    for (const id in cart) {
        const product = products.find(p => p.id == id);
        sum += product.price * cart[id];
    }

    cartCount.textContent = sum + ' ฿';
}

categories.forEach(btn => {
    btn.addEventListener('click', () => {
        categories.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.category);
    });
});

render();
const navButtons = document.querySelectorAll('.nav');
const pages = {
    menu: document.getElementById('menuPage'),
    feedback: document.getElementById('feedbackPage'),
    bonus: document.getElementById('bonusPage'),
    about: document.getElementById('aboutPage')
};

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Object.values(pages).forEach(p => p.classList.remove('active'));
        pages[btn.dataset.page].classList.add('active');
    });
});
const feedbackBtn = document.getElementById('sendFeedback');
const feedbackText = document.getElementById('feedbackText');
const feedbackStatus = document.getElementById('feedbackStatus');

feedbackBtn.addEventListener('click', () => {
    const text = feedbackText.value.trim();

    if (!text) {
        feedbackStatus.textContent = 'Введите текст';
        feedbackStatus.style.color = 'red';
        return;
    }

    // пока просто имитация отправки
    console.log('Отзыв:', text);

    feedbackStatus.textContent = 'Спасибо за отзыв!';
    feedbackStatus.style.color = 'green';
    feedbackText.value = '';
});

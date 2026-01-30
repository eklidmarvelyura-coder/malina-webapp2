const tg = window.Telegram.WebApp;
tg.ready();

const products = [
    { id: 1, name: 'Американо', price: 120, category: 'coffee' },
    { id: 2, name: 'Капучино', price: 150, category: 'coffee' },
    { id: 3, name: 'Латте', price: 170, category: 'coffee' },
    { id: 4, name: 'Пирожок с капустой', price: 80, category: 'bakery' },
    { id: 5, name: 'Пирожок с вишней', price: 90, category: 'bakery' }
];

const menu = document.getElementById('menu');
const categories = document.querySelectorAll('.category');

function render(category = 'all') {
    menu.innerHTML = '';

    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${p.name}</h3>
            <div class="price">${p.price} ₽</div>
        `;
        menu.appendChild(card);
    });
}

categories.forEach(btn => {
    btn.addEventListener('click', () => {
        categories.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.category);
    });
});

render();

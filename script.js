// Products Data
const products = [
    // Body - Sensa (Гель для душа)
    {
        id: 1,
        name: 'Жасмин + Персик',
        category: 'body',
        subcategory: 'sensa',
        type: 'Гель для душа',
        volume: '500 мл',
        price: 450,
        liquidClass: 'liquid-pink'
    },
    {
        id: 2,
        name: 'Грейпфрут и розовый перец',
        category: 'body',
        subcategory: 'sensa',
        type: 'Гель для душа',
        volume: '500 мл',
        price: 450,
        liquidClass: 'liquid-green'
    },
    {
        id: 3,
        name: 'Чистая кожа',
        category: 'body',
        subcategory: 'sensa',
        type: 'Гель для душа',
        volume: '500 мл',
        price: 450,
        liquidClass: 'liquid-blue'
    },
    // Body - Aura (Жидкое мыло)
    {
        id: 4,
        name: 'Миндальное молочко + Вишня',
        category: 'body',
        subcategory: 'aura',
        type: 'Жидкое мыло',
        volume: '500 мл',
        price: 400,
        liquidClass: 'liquid-purple'
    },
    {
        id: 5,
        name: 'Хлопок + Кокос',
        category: 'body',
        subcategory: 'aura',
        type: 'Жидкое мыло',
        volume: '500 мл',
        price: 400,
        liquidClass: 'liquid-gold'
    },
    // Auto - Modul (Автошампунь)
    {
        id: 6,
        name: 'Modul',
        category: 'auto',
        subcategory: 'modul',
        type: 'Автошампунь',
        volume: '500 мл',
        price: 500,
        liquidClass: 'liquid-blue'
    }
];

// Cart state
let cart = [];
let currentFilter = 'all';
let currentCategory = 'all';

// DOM Elements
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCategories = document.getElementById('productCategories');
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const cartModalClose = document.getElementById('cartModalClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutModalClose = document.getElementById('checkoutModalClose');
const checkoutForm = document.getElementById('checkoutForm');
const orderSummary = document.getElementById('orderSummary');
const successModal = document.getElementById('successModal');
const successClose = document.getElementById('successClose');
const wholesaleForm = document.getElementById('wholesaleForm');
const wholesaleSuccessModal = document.getElementById('wholesaleSuccessModal');
const wholesaleSuccessClose = document.getElementById('wholesaleSuccessClose');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    renderProducts();
    updateCartCount();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
            updateActiveNav(link);
        });
    });

    // Buttons with data-page attribute
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.getAttribute('data-page');
            showPage(pageId);
            const correspondingLink = document.querySelector(`[data-page="${pageId}"].nav-link`);
            if (correspondingLink) {
                updateActiveNav(correspondingLink);
            }
        });
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            currentCategory = 'all';
            renderProducts();
        });
    });

    // Cart modal
    cartBtn.addEventListener('click', openCart);
    cartModalClose.addEventListener('click', closeCart);
    document.querySelector('#cartModal .modal-overlay').addEventListener('click', closeCart);

    // Checkout modal
    checkoutBtn.addEventListener('click', openCheckout);
    checkoutModalClose.addEventListener('click', closeCheckout);
    document.querySelector('#checkoutModal .modal-overlay').addEventListener('click', closeCheckout);

    // Checkout form
    checkoutForm.addEventListener('submit', handleCheckout);

    // Success modal
    successClose.addEventListener('click', () => {
        successModal.classList.remove('active');
        cart = [];
        saveToStorage();
        updateCartCount();
        closeCheckout();
    });

    // Wholesale form
    wholesaleForm.addEventListener('submit', handleWholesaleSubmit);

    // Wholesale success modal
    wholesaleSuccessClose.addEventListener('click', () => {
        wholesaleSuccessModal.classList.remove('active');
        wholesaleForm.reset();
    });

    // Mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close modals on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeCheckout();
        }
    });
}

// Show Page
function showPage(pageId) {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update Active Nav
function updateActiveNav(activeLink) {
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

// Render Products
function renderProducts() {
    renderCategories();
    renderProductGrid();
}

// Render Categories
function renderCategories() {
    let categoriesHTML = '';
    
    if (currentFilter === 'all' || currentFilter === 'body') {
        categoriesHTML += `
            <button class="category-btn ${currentCategory === 'sensa' ? 'active' : ''}" data-category="sensa">
                Гель для душа Sensa
            </button>
            <button class="category-btn ${currentCategory === 'aura' ? 'active' : ''}" data-category="aura">
                Жидкое мыло Aura
            </button>
        `;
    }
    
    if (currentFilter === 'all' || currentFilter === 'auto') {
        categoriesHTML += `
            <button class="category-btn ${currentCategory === 'modul' ? 'active' : ''}" data-category="modul">
                Автошампунь Modul
            </button>
        `;
    }
    
    if (currentFilter !== 'all') {
        categoriesHTML = `<button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">Все</button>` + categoriesHTML;
    } else {
        categoriesHTML = `<button class="category-btn ${currentCategory === 'all' ? 'active' : ''}" data-category="all">Все</button>` + categoriesHTML;
    }
    
    productCategories.innerHTML = categoriesHTML;
    
    // Add event listeners to category buttons
    productCategories.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            productCategories.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderProductGrid();
        });
    });
}

// Render Product Grid
function renderProductGrid() {
    let filteredProducts = products;
    
    // Filter by main category
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }
    
    // Filter by subcategory
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.subcategory === currentCategory);
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="empty-cart">В данной категории пока нет товаров</p>';
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners to add-to-cart buttons
    productsGrid.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-product-id'));
            addToCart(productId);
        });
    });
}

// Create Product Card
function createProductCard(product) {
    return `
        <div class="product-card" data-category="${product.category}" data-subcategory="${product.subcategory}">
            <div class="product-image">
                <div class="product-bottle">
                    <div class="bottle-cap"></div>
                    <div class="bottle-neck"></div>
                    <div class="bottle-body">
                        <div class="bottle-liquid ${product.liquidClass}"></div>
                        <div class="bottle-label">
                            <span class="bottle-label-text">${product.type.split(' ')[0]}</span>
                            <span class="bottle-label-text" style="font-size: 8px; margin-top: 5px;">${product.name.substring(0, 15)}${product.name.length > 15 ? '...' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()} | ${product.type}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-volume">${product.volume}</p>
                <div class="product-price">${product.price} ₽</div>
                <button class="add-to-cart" data-product-id="${product.id}">В корзину</button>
            </div>
        </div>
    `;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveToStorage();
    updateCartCount();
    showNotification('Товар добавлен в корзину');
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--color-primary);
        color: white;
        padding: 15px 30px;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Open Cart
function openCart() {
    renderCart();
    cartModal.classList.add('active');
}

// Close Cart
function closeCart() {
    cartModal.classList.remove('active');
}

// Render Cart
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        cartTotal.style.display = 'none';
        checkoutBtn.style.display = 'none';
        return;
    }
    
    cartTotal.style.display = 'flex';
    checkoutBtn.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-volume">${item.volume} × ${item.quantity}</div>
            </div>
            <div class="cart-item-price">${item.price * item.quantity} ₽</div>
            <button class="cart-item-remove" data-product-id="${item.id}">&times;</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.querySelector('.total-price').textContent = `${total} ₽`;
    
    // Add event listeners to remove buttons
    cartItems.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-product-id'));
            removeFromCart(productId);
        });
    });
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveToStorage();
    updateCartCount();
    renderCart();
}

// Open Checkout
function openCheckout() {
    closeCart();
    renderOrderSummary();
    checkoutModal.classList.add('active');
}

// Close Checkout
function closeCheckout() {
    checkoutModal.classList.remove('active');
}

// Render Order Summary
function renderOrderSummary() {
    const summary = cart.map(item => `
        <div>${item.name} (${item.volume}) × ${item.quantity} — ${item.price * item.quantity} ₽</div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    orderSummary.innerHTML = `
        ${summary}
        <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--color-light-gray); font-weight: 600;">
            Итого: ${total} ₽
        </div>
    `;
}

// Handle Checkout
function handleCheckout(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        comment: formData.get('comment'),
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    // In a real application, you would send this data to a server
    // For now, we'll simulate sending an email
    console.log('Order data:', orderData);
    console.log('Email should be sent to: order@mireacare.ru');
    
    // Show success modal
    successModal.classList.add('active');
}

// Handle Wholesale Submit
function handleWholesaleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const wholesaleData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        company: formData.get('company'),
        message: formData.get('message')
    };
    
    // In a real application, you would send this data to a server
    // For now, we'll simulate sending an email
    console.log('Wholesale data:', wholesaleData);
    console.log('Email should be sent to: cooperation@mireacare.ru');
    
    // Show success modal
    wholesaleSuccessModal.classList.add('active');
}

// Local Storage Functions
function saveToStorage() {
    localStorage.setItem('mireaCart', JSON.stringify(cart));
}

function loadFromStorage() {
    const savedCart = localStorage.getItem('mireaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

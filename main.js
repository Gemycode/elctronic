let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null;

const products = [
    {
        id: 1,
        name: "Smartphone X11",
        price: 799.99,
        image: "./smart.jpg"
    },
    {
        id: 2,
        name: "Laptop Pro",
        price: 1299.99,
        image: "laptob.jpg"
    },
    {
        id: 3,
        name: "Wireless Headphones",
        price: 149.99,
        image: "head.jpg"
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 249.99,
        image: "watch.jpg"
    }
];

let cart = [];

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const mainContent = document.getElementById('main-content');
const usernameDisplay = document.getElementById('username-display');
const logoutBtn = document.getElementById('logout-btn');
const productsContainer = document.getElementById('products-container');
const cartDropArea = document.getElementById('cart-drop-area');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyCartMessage = document.getElementById('empty-cart-message');
const viewProductsBtn = document.getElementById('view-products-btn');

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageId}-page`).classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-link[data-page="${pageId}"]`).classList.add('active');
}

function displayProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('draggable', 'true');
        productCard.dataset.id = product.id;
        productCard.dataset.name = product.name;
        productCard.dataset.price = product.price;
        productCard.dataset.image = product.image;
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
        
        productCard.addEventListener('dragstart', handleDragStart);
        productCard.addEventListener('dragend', handleDragEnd);
    });
}

function updateCartDisplay() {
    cartItems.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
        
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                    </div>
                </div>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;
            
            cartItems.appendChild(cartItem);
        });
    }
    
}

function addToCart(productId) {
    const product = products.find(p => p.id === parseInt(productId));
    
    if (product) {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image
        });
        
        updateCartDisplay();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

function handleDragStart(e) {
    this.classList.add('dragging');
    
    const productData = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: this.dataset.price,
        image: this.dataset.image
    };
    
    e.dataTransfer.setData('text/plain', JSON.stringify(productData));
}

function handleDragEnd() {
    this.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('highlight');
}

function handleDragLeave() {
    this.classList.remove('highlight');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('highlight');
    
    try {
        const productData = JSON.parse(e.dataTransfer.getData('text/plain'));
        
        cart.push({
            id: parseInt(productData.id),
            name: productData.name,
            price: parseFloat(productData.price),
            image: productData.image
        });
        
        updateCartDisplay();
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}

function registerUser(username, email, password) {
    const userExists = users.some(user => user.username === username || user.email === email);
    
    if (userExists) {
        alert('Username or email already exists');
        return false;
    }
    
    const newUser = {
        username,
        email,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function loginUser(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    
    return false;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    mainContent.style.display = 'none';
    loginForm.style.display = 'flex';
}

function checkLoggedInUser() {
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        usernameDisplay.textContent = `Welcome, ${currentUser.username}`;
        loginForm.style.display = 'none';
        mainContent.style.display = 'block';
        return true;
    }
    
    return false;
}

document.getElementById('show-register').addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
});

document.getElementById('show-login').addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    if (loginUser(username, password)) {
        usernameDisplay.textContent = `Welcome, ${username}`;
        loginForm.style.display = 'none';
        mainContent.style.display = 'block';
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (registerUser(username, email, password)) {
        alert('Registration successful! Please login.');
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
    }
});

logoutBtn.addEventListener('click', logoutUser);

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        showPage(this.dataset.page);
    });
});

viewProductsBtn.addEventListener('click', function() {
    showPage('products');
});

productsContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        addToCart(e.target.dataset.id);
    }
});

cartItems.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-from-cart')) {
        removeFromCart(parseInt(e.target.dataset.index));
    }
});

cartDropArea.addEventListener('dragover', handleDragOver);
cartDropArea.addEventListener('dragleave', handleDragLeave);
cartDropArea.addEventListener('drop', handleDrop);

function initApp() {
    displayProducts();
    updateCartDisplay();
    
    if (!checkLoggedInUser()) {
        loginForm.style.display = 'flex';
        mainContent.style.display = 'none';
    }
}

initApp();
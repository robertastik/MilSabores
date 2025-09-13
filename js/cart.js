
import { products } from './product-data.js';

// Cart state and helpers at module (top) level so other modules can import addToCart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.querySelector('.cart-count');

    if (!cartItemsContainer || !cartTotalAmount) return;

    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'cart-empty';
        empty.textContent = 'Tu carrito está vacío.';
        cartItemsContainer.appendChild(empty);
    }
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Precio: ${item.price.toLocaleString('es-CL')}</p>
                <p>Cantidad: ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <button class="remove-item" data-id="${item.id}">&times;</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
        total += item.price * item.quantity;
        totalItems += item.quantity;
    });

    cartTotalAmount.textContent = `${total.toLocaleString('es-CL')}`;
    if (cartCount) cartCount.textContent = totalItems;

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.dataset.id);
            removeFromCart(productId);
        });
    });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

// DOM ready: attach UI listeners that depend on elements
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    const cartIcon = document.querySelector('.carrito');
    const closeCartButton = document.querySelector('.close-cart');

    if (cartIcon && cartContainer) {
        cartIcon.addEventListener('click', () => {
            cartContainer.classList.add('open');
        });
    }

    if (closeCartButton && cartContainer) {
        closeCartButton.addEventListener('click', () => {
            cartContainer.classList.remove('open');
        });
    }

    // Initial render
    renderCart();
});

// Event delegation: handle clicks on .carrito even if header is injected later
document.addEventListener('click', (event) => {
    const clickedCart = event.target.closest && event.target.closest('.carrito');
    if (clickedCart) {
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.classList.add('open');
            // ensure cart content is up-to-date when opening
            renderCart();
        }
    }
});

// Watch for header injection so we can update the cart count when the header (and .cart-count) appears
const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            if (node.classList && node.classList.contains('carrito')) {
                // header inserted with .carrito
                renderCart();
                return;
            }
            if (node.querySelector && node.querySelector('.cart-count')) {
                renderCart();
                return;
            }
        }
    }
});

if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
}

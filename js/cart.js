
import { productos } from './product-data.js';

let carrito = JSON.parse(localStorage.getItem('cart')) || [];

function guardarCarrito() {
    localStorage.setItem('cart', JSON.stringify(carrito));
}

export function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);
    if (productoExistente) {
        productoExistente.quantity += 1;
    } else {
        carrito.push({ ...producto, quantity: 1 });
    }
    guardarCarrito();
    renderizarCarrito();
}

function renderizarCarrito() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.querySelector('.cart-count');

    if (!cartItemsContainer || !cartTotalAmount) return;

    cartItemsContainer.innerHTML = '';
    if (carrito.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'cart-empty';
        empty.textContent = 'Tu carrito está vacío.';
        cartItemsContainer.appendChild(empty);
    }
    let total = 0;
    let totalItems = 0;

    carrito.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Precio: ${item.price.toLocaleString('es-CL')}</p>
                <div class="cart-quantity">
                    <button class="qty-decrease" data-id="${item.id}">-</button>
                    <span class="qty-value" data-id="${item.id}">${item.quantity}</span>
                    <button class="qty-increase" data-id="${item.id}">+</button>
                </div>
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

    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.dataset.id);
            eliminarDelCarrito(productId);
        });
    });

}

function eliminarDelCarrito(productId) {
    carrito = carrito.filter(item => item.id !== productId);
    guardarCarrito();
    renderizarCarrito();
}

function actualizarCantidad(productId, delta) {
    const index = carrito.findIndex(i => i.id === productId);
    if (index === -1) return;
    carrito[index].quantity += delta;
    if (carrito[index].quantity <= 0) {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    renderizarCarrito();
}

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

    const cartItems = document.querySelector('.cart-items');
    if (cartItems) {
        cartItems.addEventListener('click', (event) => {
            const dec = event.target.closest && event.target.closest('.qty-decrease');
            const inc = event.target.closest && event.target.closest('.qty-increase');
            if (dec) {
                const id = parseInt(dec.dataset.id, 10);
                actualizarCantidad(id, -1);
            } else if (inc) {
                const id = parseInt(inc.dataset.id, 10);
                actualizarCantidad(id, 1);
            }
        });
    }

    renderizarCarrito();
});

document.addEventListener('click', (event) => {
    const clickedCart = event.target.closest && event.target.closest('.carrito');
    if (clickedCart) {
        const cartContainer = document.querySelector('.cart-container');
        if (cartContainer) {
            cartContainer.classList.add('open');
            renderizarCarrito();
        }
    }
});

const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
        for (const node of m.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            if (node.classList && node.classList.contains('carrito')) {
                renderizarCarrito();
                return;
            }
            if (node.querySelector && node.querySelector('.cart-count')) {
                renderizarCarrito();
                return;
            }
        }
    }
});

if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
}

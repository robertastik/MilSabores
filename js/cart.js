
import { productos } from './product-data.js';

let carrito = JSON.parse(localStorage.getItem('cart')) || [];
let mapaEnvio = null;

function obtenerUsuarioActual() {
    const currentUserEmail = localStorage.getItem('currentUser');
    if (!currentUserEmail) return null;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    return usuarios.find(u => u.correo === currentUserEmail);
}

// permiso para mostrar notificaciones 
function solicitarPermisoNotificaciones() {
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }
}

// muestra una notificación 
function mostrarNotificacion(titulo, opciones) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(titulo, { ...opciones, icon: 'images/user (1).svg' });
    }
}

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

function calcularDescuentos() {
    const usuarioActual = obtenerUsuarioActual();
    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = 0;
    let discountMessages = [];

    if (usuarioActual && carrito.length > 0) {
        // dcto por edad (50%)
        const ageDiscount = usuarioActual.descuentos.find(d => d.tipo === 'Edad');
        if (ageDiscount) {
            discountAmount += total * (ageDiscount.porcentaje / 100);
            discountMessages.push(`Descuento ${ageDiscount.porcentaje}% por edad`);
        } else {
            // dcto por código "FELICES50" (10%)
            const couponDiscount = usuarioActual.descuentos.find(d => d.tipo === 'Código FELICES50');
            if (couponDiscount) {
                discountAmount += total * (couponDiscount.porcentaje / 100);
                discountMessages.push(`Descuento ${couponDiscount.porcentaje}% por código FELICES50`);
            }
        }

        // torta gratis para estudiante Duoc en su cumpleaños.
        if (usuarioActual.correo.endsWith('@duocuc.cl')) {
            const hoy = new Date();
            const [year, month, day] = usuarioActual.fechaNacimiento.split('-').map(Number);
            const nacimiento = new Date(year, month - 1, day);

            if (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() === nacimiento.getDate()) {
                const cheapestItem = carrito.reduce((min, item) => item.price < min.price ? item : min);
                discountAmount += cheapestItem.price;
                discountMessages.push(`¡Torta gratis por tu cumpleaños!`);
            }
        }
    }

    const finalTotal = total - discountAmount;
    return { total, discountAmount, discountMessages, finalTotal };
}

function renderizarCarrito() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCount = document.querySelector('.cart-count');
    const checkoutButton = document.querySelector('.checkout-btn');
    const cartFooter = document.querySelector('.cart-footer');
    
    if (checkoutButton) {
        checkoutButton.textContent = 'Finalizar Compra';
        checkoutButton.disabled = carrito.length === 0;
    }

    if (!cartItemsContainer || !cartTotalAmount) return;

    cartItemsContainer.innerHTML = '';
    if (carrito.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'cart-empty';
        empty.textContent = 'Tu carrito está vacío.';
        cartItemsContainer.appendChild(empty);
    }
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
        totalItems += item.quantity;
    });

    const { total, discountAmount, discountMessages, finalTotal } = calcularDescuentos();

    cartFooter.innerHTML = `
        <div class="cart-total">
            <span>Subtotal:</span>
            <span>$${total.toLocaleString('es-CL')}</span>
        </div>
        ${discountAmount > 0 ? `
            <div class="cart-discount-details">${discountMessages.map(msg => `<div class="cart-discount-reason">${msg}</div>`).join('')}</div>
            <div class="cart-discount-total"><span>Descuento:</span> <span class="discount-amount">-$${Math.round(discountAmount).toLocaleString('es-CL')}</span></div>` : ''}
        <div class="cart-total final-total">
            <span>Total:</span><span id="cart-total-amount">$${Math.round(finalTotal).toLocaleString('es-CL')}</span>
        </div>
        <button class="checkout-btn" ${carrito.length === 0 ? 'disabled' : ''}>Finalizar Compra</button>
    `;
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

function vaciarCarritoYActualizar() {
    carrito = [];
    guardarCarrito();
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = 0;
    }
    // 
    if (mapaEnvio) {
        mapaEnvio.remove();
        mapaEnvio = null;
    }
}

function iniciarVistaEnvio() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartFooter = document.querySelector('.cart-footer');
    const checkoutButton = cartFooter.querySelector('.checkout-btn');
    const cartTotalDiv = cartFooter.querySelector('.cart-total');

    // pantalla de carga
    cartItemsContainer.innerHTML = `
        <div class="shipping-loading" style="padding: 40px 20px; text-align: center; font-size: 1.2em; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
            <p>Buscando envío...</p>
        </div>
    `;
    if (cartTotalDiv) cartTotalDiv.style.display = 'none';
    if (checkoutButton) {
        checkoutButton.textContent = 'Cargando...';
        checkoutButton.disabled = true;
    }

    // esperar 5 segundos y luego mostrar el mapa
    setTimeout(() => {
        // mostrar vista mapa
        mostrarVistaEnvio();
    }, 5000);
}

function mostrarVistaEnvio() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartFooter = document.querySelector('.cart-footer');
    const checkoutButton = cartFooter.querySelector('.checkout-btn');
    const cartTotalDiv = cartFooter.querySelector('.cart-total');

    // actualizar vista del carrito
    cartItemsContainer.innerHTML = `
        <div class="shipping-tracking" style="padding: 20px; text-align: center;">
            <h3 style="margin-bottom: 15px;">¡Sigue tu envío en tiempo real!</h3>
            <div id="mapa-envio" style="height: 300px; width: 100%; border-radius: 8px; margin-top: 10px;"></div>
            <p style="margin-top: 15px; font-weight: bold; font-size: 1.1em;">¡Tu pedido está por llegar!</p>
        </div>
    `;
    if (cartTotalDiv) cartTotalDiv.style.display = 'none';
    if (checkoutButton) {
        checkoutButton.textContent = 'Cerrar';
        checkoutButton.disabled = false;
    }

    // coordenadas aleatorias (alrededor de Santiago de Chile)
    const lat = -33.4489 + (Math.random() - 0.5) * 0.1;
    const lng = -70.6693 + (Math.random() - 0.5) * 0.2;

    // inicializar el mapa de Leaflet
    setTimeout(() => {
        
        if (mapaEnvio) {
            mapaEnvio.remove();
        }
        mapaEnvio = L.map('mapa-envio').setView([lat, lng], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapaEnvio);

        L.marker([lat, lng]).addTo(mapaEnvio)
            .bindPopup('Tu pedido está aquí.')
            .openPopup();
    }, 100); 
}

function procesarCompra() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartFooter = document.querySelector('.cart-footer');
    const checkoutButton = cartFooter.querySelector('.checkout-btn');
    const cartTotalDiv = cartFooter.querySelector('.cart-total');

    if (carrito.length === 0) {
        alert('Tu carrito está vacío, selecciona el producto que deseas.');
        return;
    }

    // procesando compra
    cartItemsContainer.innerHTML = `<div class="cart-processing" style="padding: 40px 20px; text-align: center; font-size: 1.2em;">Procesando compra...</div>`;
    if (cartTotalDiv) cartTotalDiv.style.display = 'none';
    if (checkoutButton) checkoutButton.disabled = true;

    // mostrar boleta despues de 2 segundos
    setTimeout(() => {
        const { total, discountAmount, discountMessages, finalTotal } = calcularDescuentos();

        const boletaHTML = `
            <div class="receipt-container" style="padding: 10px 20px;">
                <h3 style="text-align: center; margin-bottom: 10px;">Compra Realizada</h3>
                <p style="text-align: center; margin-bottom: 20px;"><strong>Boleta de Compra</strong></p>
                
                <div class="receipt-details" style="font-size: 0.9em;">
                    <div style="display: flex; justify-content: space-between; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 5px; margin-bottom: 10px;">
                        <span style="flex: 3;">Producto</span>
                        <span style="flex: 1; text-align: center;">Cant.</span>
                        <span style="flex: 2; text-align: right;">Subtotal</span>
                    </div>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${carrito.map(item => `
                            <li style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee;">
                                <span style="flex: 3;">${item.name}</span>
                                <span style="flex: 1; text-align: center;">${item.quantity}</span>
                                <span style="flex: 2; text-align: right;">$${(item.price * item.quantity).toLocaleString('es-CL')}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div style="text-align: right; margin-top: 20px; font-size: 1em; padding-right: 10px;">
                    Subtotal: $${total.toLocaleString('es-CL')}
                </div>
                ${discountAmount > 0 ? `
                    <div style="text-align: right; font-size: 1em; color: green; padding-right: 10px;">
                        Descuento: -$${Math.round(discountAmount).toLocaleString('es-CL')}
                    </div>
                    <div style="text-align: right; font-size: 0.8em; color: #666; padding-right: 10px; margin-bottom: 10px;">
                        (${discountMessages.join(', ')})
                    </div>
                ` : ''}
                <div style="text-align: right; margin-top: 20px; font-weight: bold; font-size: 1.2em; padding-right: 10px;">
                    Total: $${Math.round(finalTotal).toLocaleString('es-CL')}
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML = boletaHTML;

        
        if (checkoutButton) {
            checkoutButton.textContent = 'Ver envío';
            checkoutButton.disabled = false;
        }

      
        mostrarNotificacion('¡Compra Exitosa!', {
            body: 'Tu boleta ha sido generada. Gracias por tu compra.'
        });

       
    }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    const closeCartButton = document.querySelector('.close-cart');
    const cartFooter = document.querySelector('.cart-footer');
    // permiso para notificaciones al cargar la página.
    solicitarPermisoNotificaciones();

   
    document.body.addEventListener('click', (event) => {
        if (event.target.closest('.carrito')) {
            cartContainer.classList.add('open');
            renderizarCarrito();
        }
    });

    if (closeCartButton && cartContainer) {
        closeCartButton.addEventListener('click', () => {
            
            if (checkoutButton && (checkoutButton.textContent === 'Ver envío' || checkoutButton.textContent === 'Cerrar')) {
                vaciarCarritoYActualizar();
            }
            cartContainer.classList.remove('open');
        });
    }

    if (cartFooter) {
        cartFooter.addEventListener('click', (event) => {
            if (event.target.classList.contains('checkout-btn')) {
                const checkoutButton = event.target;
                const buttonText = checkoutButton.textContent;
                if (buttonText === 'Ver envío') {
                    mostrarNotificacion('¡Tu pedido está en camino!', {
                        body: 'Puedes seguir el estado de tu envío en tiempo real.'
                    });
                    iniciarVistaEnvio();
                } else if (buttonText === 'Cerrar') {
                    mostrarNotificacion('¡El pedido está en tu puerta!', {
                        body: 'Gracias por tu compra en Mil Sabores.'
                    });
                    vaciarCarritoYActualizar();
                    if (cartContainer) {
                        cartContainer.classList.remove('open');
                    }
                } else { 
                    procesarCompra();
                }
            }
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

    // modal compartir
    const shareModalOverlay = document.getElementById('share-modal-overlay');
    const closeShareModalBtn = document.querySelector('.close-share-modal');
    const shareSocialButtons = document.querySelectorAll('#share-modal-overlay .social-buttons button');
    const shareModal = document.querySelector('.share-modal');

    function showShareModal() {
        if(shareModalOverlay) {
            // restaura el modal 
            if (shareModal) {
                const title = shareModal.querySelector('h3');
                const buttons = shareModal.querySelector('.social-buttons');
                if (title) title.textContent = 'Compartir Producto';
                if (buttons) buttons.style.display = 'flex';
            }
            shareModalOverlay.classList.add('visible');
        }
    }

    function hideShareModal() {
        if(shareModalOverlay) shareModalOverlay.classList.remove('visible');
    }

        document.body.addEventListener('click', (event) => {
        if (event.target.closest('.btn-share')) {
            showShareModal();
        }
    });

    if (closeShareModalBtn) {
        closeShareModalBtn.addEventListener('click', hideShareModal);
    }

    if (shareModalOverlay) {
        shareModalOverlay.addEventListener('click', (event) => {
            if (event.target === shareModalOverlay) { // Click en el fondo
                hideShareModal();
            }
        });
    }

    shareSocialButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (shareModal) {
                const title = shareModal.querySelector('h3');
                const buttons = shareModal.querySelector('.social-buttons');
                if (title) title.textContent = '¡Gracias por compartir nuestros productos!';
                if (buttons) buttons.style.display = 'none';
            }
        });
    });
});

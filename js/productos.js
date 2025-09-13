import { products } from './product-data.js';
import { addToCart } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const filtroTipo = document.getElementById('filtro-tipo');
  const filtroTamano = document.getElementById('filtro-tamano');

  function renderProducts(filteredProducts) {
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.dataset.id = product.id;
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Tipo: ${product.type}</p>
        <p>Tamaño: ${product.size}</p>
        <p class="price">$${product.price.toLocaleString('es-CL')}</p>
        <div class="custom-message">
          <label for="message-${product.id}">Mensaje Especial:</label>
          <input type="text" id="message-${product.id}" placeholder="¡Feliz Cumpleaños!">
        </div>
        <button class="btn-add-cart">Añadir al Carrito</button>
      `;
      productList.appendChild(productCard);
    });

    // Add to cart event listeners
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const productCard = event.target.closest('.product-card');
        const productId = parseInt(productCard.dataset.id);
        const product = products.find(p => p.id === productId);
        addToCart(product);
      });
    });
  }

  function filterProducts() {
    const tipo = filtroTipo.value;
    const tamano = filtroTamano.value;

    let filteredProducts = products;

    if (tipo !== 'todos') {
      filteredProducts = filteredProducts.filter(p => p.type === tipo);
    }

    if (tamano !== 'todos') {
      filteredProducts = filteredProducts.filter(p => p.size === tamano);
    }

    renderProducts(filteredProducts);
  }

  if (filtroTipo && filtroTamano) {
    filtroTipo.addEventListener('change', filterProducts);
    filtroTamano.addEventListener('change', filterProducts);
  }

  // Initial render
  if(productList) {
    renderProducts(products);
  }
});
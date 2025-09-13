import { products } from './product-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('featured-products');

  function renderProducts(products) {
    productList.innerHTML = '';
    const productTrack = document.createElement('div');
    productTrack.className = 'product-track';

    // Duplicate products for seamless loop
    const extendedProducts = [...products, ...products];

    extendedProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="price">$${product.price.toLocaleString('es-CL')}</p>
        <a href="productos.html" class="btn-add-cart">Ver Detalles</a>
      `;
      productTrack.appendChild(productCard);
    });
    productList.appendChild(productTrack);
  }

  // We will use all products for the carousel
  renderProducts(products);
});
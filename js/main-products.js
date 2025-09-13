import { products } from './product-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('featured-products');

  if (!productList) {
    console.warn('main-products: #featured-products element not found. Skipping render.');
    return;
  }

  function renderProducts(products) {
    productList.innerHTML = '';
    const productTrack = document.createElement('div');
    productTrack.className = 'product-track';

    
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

  renderProducts(products);
});
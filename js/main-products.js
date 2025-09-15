import { productos } from './product-data.js';
import { agregarAlCarrito } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('featured-products');

  function renderizarProductos(productosLista) {
    productList.innerHTML = '';
    const productTrack = document.createElement('div');
    productTrack.className = 'product-track';

    const extendedProductos = [...productosLista, ...productosLista];

    extendedProductos.forEach(producto => {
      const tarjetaProducto = document.createElement('div');
      tarjetaProducto.className = 'product-card';
      tarjetaProducto.dataset.id = producto.id;
      tarjetaProducto.innerHTML = `
        <img src="${producto.image}" alt="${producto.name}">
        <div class="card-body">
          <h3>${producto.name}</h3>
          <p class="price">$${producto.price.toLocaleString('es-CL')}</p>
        </div>
        <div class="card-footer">
          <div class="custom-message">
            <label for="message-${producto.id}">Mensaje Especial:</label>
            <input type="text" id="message-${producto.id}" placeholder="¡Feliz Cumpleaños!">
          </div>
          <button class="btn-add-cart">Añadir al Carrito</button>
        </div>
      `;
      productTrack.appendChild(tarjetaProducto);
    });
    productList.appendChild(productTrack);
  }

  renderizarProductos(productos);

  // Delegated click handler for add-to-cart in the featured carousel
  productList.addEventListener('click', (event) => {
    const btn = event.target.closest && event.target.closest('.btn-add-cart');
    if (!btn) return;
    const tarjeta = btn.closest('.product-card');
    if (!tarjeta) return;
    const id = parseInt(tarjeta.dataset.id, 10);
    const producto = productos.find(p => p.id === id);
    if (producto) agregarAlCarrito(producto);
  });
});
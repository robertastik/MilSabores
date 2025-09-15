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
          <div class="card-footer-actions">
            <button class="btn-add-cart">Añadir al Carrito</button>
            <button class="btn-share" aria-label="Compartir producto">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5D4037" width="24px" height="24px"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/></svg>
            </button>
          </div>
        </div>
      `;
      productTrack.appendChild(tarjetaProducto);
    });
    productList.appendChild(productTrack);
  }

  renderizarProductos(productos);

  
  productList.addEventListener('click', (event) => {
    const btn = event.target.closest && event.target.closest('.btn-add-cart');
    if (btn) {
      const tarjeta = btn.closest('.product-card');
      if (!tarjeta) return;
      const id = parseInt(tarjeta.dataset.id, 10);
      const producto = productos.find(p => p.id === id);
      if (producto) agregarAlCarrito(producto);
    }
  });
});
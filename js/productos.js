import { productos } from './product-data.js';
import { agregarAlCarrito } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const filtroTipo = document.getElementById('filtro-tipo');
  const filtroTamano = document.getElementById('filtro-tamano');

  function renderizarProductos(productosFiltrados) {
    productList.innerHTML = '';
    productosFiltrados.forEach(producto => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'product-card';
      tarjeta.dataset.id = producto.id;
      tarjeta.innerHTML = `
        <img src="${producto.image}" alt="${producto.name}">
        <div class="card-body">
          <h3>${producto.name}</h3>
          <p>Tipo: ${producto.type}</p>
          <p>Tamaño: ${producto.size}</p>
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
      productList.appendChild(tarjeta);
    });
  }

  function filtrarProductos() {
    const tipo = filtroTipo.value;
    const tamano = filtroTamano.value;

    let productosFiltrados = productos;

    if (tipo !== 'todos') {
      productosFiltrados = productosFiltrados.filter(p => p.type === tipo);
    }

    if (tamano !== 'todos') {
      productosFiltrados = productosFiltrados.filter(p => p.size === tamano);
    }

    renderizarProductos(productosFiltrados);
  }

  if (filtroTipo && filtroTamano) {
  filtroTipo.addEventListener('change', filtrarProductos);
  filtroTamano.addEventListener('change', filtrarProductos);
  }

  if(productList) {
    renderizarProductos(productos);

   
    productList.addEventListener('click', (event) => {
      const btn = event.target.closest('.btn-add-cart');
      if (btn) {
        const tarjetaProducto = event.target.closest('.product-card');
        const productoId = parseInt(tarjetaProducto.dataset.id);
        const producto = productos.find(p => p.id === productoId);
        if (producto) agregarAlCarrito(producto);
      }
    });
  }
});
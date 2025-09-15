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
          <button class="btn-add-cart">Añadir al Carrito</button>
        </div>
      `;
      productList.appendChild(tarjeta);
    });

    const botonesAgregar = document.querySelectorAll('.btn-add-cart');
    botonesAgregar.forEach(boton => {
      boton.addEventListener('click', (event) => {
        const tarjetaProducto = event.target.closest('.product-card');
        const productoId = parseInt(tarjetaProducto.dataset.id);
        const producto = productos.find(p => p.id === productoId);
        agregarAlCarrito(producto);
      });
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
  }
});
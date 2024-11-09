let productos = localStorage.getItem("cartItems");
productos = JSON.parse(productos) || [];

const containerProductos = document.getElementById("productosSeleccionados");
const cantidadProductos = document.getElementById("cantidadProductos");
const tabla = document.getElementById("tabla");
const containerTotal = document.getElementById("total");
const moneda = document.getElementById("moneda");
const cartCountBadge = document.getElementById("cart-count-badge");

// Mostrar productos y actualizar cantidades
function mostrarProductos() {
  containerProductos.innerHTML = "";
  tabla.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  if (!productos.length) {
    containerProductos.textContent = "No existen elementos seleccionados";
    cantidadProductos.textContent = 0;
    cartCountBadge.textContent = 0;
  } else {
    productos.forEach((product, index) => {
      const subtotal = product.unitCost * product.count;
      total += subtotal;
      totalItems += product.count;

      // Crear fila en la tabla para el producto
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.name} x<span id="count-${index}">${product.count}</span></td>
        <td class="text-end">$<span id="subtotal-${index}">${subtotal}</span></td>
      `;
      tabla.appendChild(row);
      moneda.textContent += `${product.currency} `;

      // Crear tarjeta del producto en la lista
      const card = document.createElement("li");
      card.innerHTML = `
        <article class="d-flex my-2 flex-row align-items-center">
          <img src="${product.image}" alt="${product.name}" />
          <div class="d-flex flex-column justify-content-between mx-2">
            <h3 class="fs-4 mb-0">${product.name}</h3>
            <p class="mb-0"><span>${product.currency} $</span>${product.unitCost}</p>
          </div>
          <label for="cantidad">x</label>
          <input name="cantidad" type="number" value="${product.count}" min="1" data-index="${index}" />
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">Eliminar</button>
        </article>
      `;
      containerProductos.appendChild(card);

      // Añadir evento para actualizar cantidad en tiempo real
      const quantityInput = card.querySelector(`input[name="cantidad"]`);
      quantityInput.addEventListener("input", (event) => updateQuantity(event, index));
    });

    // Actualizar la cantidad de productos y el badge
    cantidadProductos.textContent = productos.length;
    cartCountBadge.textContent = totalItems; // Mostrar total de productos en el badge
    containerTotal.textContent = `Total: $${total.toFixed(2)}`;
  }
}

// Función para actualizar cantidad, subtotal y total
function updateQuantity(event, index) {
  const newQuantity = parseInt(event.target.value);
  productos[index].count = newQuantity;

  // Actualiza el subtotal del producto
  const newSubtotal = productos[index].unitCost * newQuantity;
  document.getElementById(`subtotal-${index}`).textContent = newSubtotal.toFixed(2);
  document.getElementById(`count-${index}`).textContent = newQuantity;

  // Recalcula el total y total de productos
  const newTotal = productos.reduce((acc, product) => acc + product.unitCost * product.count, 0);
  const newTotalItems = productos.reduce((acc, product) => acc + product.count, 0);
  
  containerTotal.textContent = `Total: $${newTotal.toFixed(2)}`;
  cartCountBadge.textContent = newTotalItems; // Actualizar el badge

  // Guarda los cambios en localStorage
  localStorage.setItem("cartItems", JSON.stringify(productos));
}

// Función para eliminar un producto
function eliminarProducto(index) {
  productos.splice(index, 1); 
  localStorage.setItem("cartItems", JSON.stringify(productos)); 
  mostrarProductos();
}

// Inicializar mostrando productos en el carrito
mostrarProductos();
function showShippingForm() {
  // Obtener el elemento del formulario de envío
  const shippingForm = document.getElementById('shipping-form');

  // Desplazar la página hasta el formulario de envío
  shippingForm.scrollIntoView({ behavior: 'smooth' });
}

// Obtener el formulario de envío
const shippingForm = document.getElementById('shipping-form-container');

// Agregar un evento de envío al formulario
shippingForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que se envíe el formulario

  // Verificar si todos los campos obligatorios están completos
  if (shippingForm.reportValidity()) {
    // Todos los campos están completos, enviar el formulario
    shippingForm.submit();
  } else {
    // Mostrar un mensaje de error
    showErrorMessage('Por favor, complete todos los campos obligatorios.');
  }
});

// Función para mostrar un mensaje de error
function showErrorMessage(message) {
  // Crear un elemento de alerta y mostrarlo en la página
  const alert = document.createElement('div');
  alert.classList.add('alert', 'alert-danger', 'alert-dismissible', 'fade', 'show');
  alert.setAttribute('role', 'alert');
  alert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
  document.body.appendChild(alert);
}
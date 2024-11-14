// Carga inicial de productos desde localStorage
let productos = JSON.parse(localStorage.getItem("cartItems")) || [];

// Mostrar productos en el carrito y actualizar cantidades y totales
function mostrarProductos() {
  document.getElementById("productosSeleccionados").innerHTML = "";
  document.getElementById("tabla").innerHTML = "";
  let total = 0;
  let totalItems = 0;
  
  if (!productos.length) {
    actualizarVistaVacia();
  } else {
    productos.forEach((product, index) => {
      const subtotal = product.unitCost * product.count;
      total += subtotal;
      totalItems += product.count;
      agregarFilaTabla(product, index, subtotal);
      agregarCardProducto(product, index);
    });

    actualizarTotales(total, totalItems);
  }
}

function actualizarVistaVacia() {
  document.getElementById("productosSeleccionados").textContent = "No existen elementos seleccionados";
  document.getElementById("cantidadProductos").textContent = 0;
  document.getElementById("cart-count-badge").textContent = 0;
  document.getElementById("total").textContent = "$0.00";
}

function agregarFilaTabla(product, index, subtotal) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${product.name} x<span id="count-${index}">${product.count}</span></td>
    <td class="text-end">$<span id="subtotal-${index}">${subtotal.toFixed(2)}</span></td>
  `;
  document.getElementById("tabla").appendChild(fila);
  document.getElementById("moneda").textContent = product.currency;
}

function agregarCardProducto(product, index) {
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
  document.getElementById("productosSeleccionados").appendChild(card);
  card.querySelector(`input[name="cantidad"]`).addEventListener("input", (event) => actualizarCantidad(event, index));
}

function actualizarTotales(total, totalItems) {
  document.getElementById("cantidadProductos").textContent = productos.length;
  document.getElementById("cart-count-badge").textContent = totalItems;
  document.getElementById("total").textContent = `Total: $${total.toFixed(2)}`;
}

// Actualizar cantidad de producto
function actualizarCantidad(event, index) {
  const newQuantity = parseInt(event.target.value);
  productos[index].count = newQuantity;
  recalcularTotal();
  actualizarVistaLocalStorage();
}

// Recalcular total del carrito
function recalcularTotal() {
  let total = 0;
  productos.forEach(product => total += product.unitCost * product.count);

  const tipoEnvio = document.querySelector("#opciones-compra select:nth-of-type(2)").value;
  const costoEnvio = calcularCostoEnvio(total, tipoEnvio);

  actualizarVistaTotales(total, costoEnvio);
}

function calcularCostoEnvio(total, tipoEnvio) {
  const tarifas = { express: 0.07, premium: 0.15, estandar: 0.05 };
  return total * (tarifas[tipoEnvio] || 0);
}

function actualizarVistaTotales(total, costoEnvio) {
  document.getElementById("subtotalProductos").textContent = `$${total.toFixed(2)}`;
  document.getElementById("costoEnvio").textContent = `$${costoEnvio.toFixed(2)}`;
  document.getElementById("totalCompra").textContent = `$${(total + costoEnvio).toFixed(2)}`;
  document.getElementById("cart-count-badge").textContent = productos.reduce((acc, product) => acc + product.count, 0);
}

function actualizarVistaLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(productos));
}

// Eliminar producto
function eliminarProducto(index) {
  productos.splice(index, 1);
  actualizarVistaLocalStorage();
  mostrarProductos();
}

function scrollearHasta(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}

// Validar datos de compra
function validarDatosCompra() {
  if (!productos.length) {
    Swal.fire("Error", 'Por favor, agregue al menos un producto al carrito.', "error").then(() => {
      setTimeout(() => scrollearHasta('cart-count-badge'), 200);
    });
    return false;
  }

  const direccionCampos = ['departamento', 'localidad', 'calle', 'numero', 'apartamento'];
  if (!direccionCampos.every(campo => document.getElementById(campo).value)) {
    Swal.fire("Error", 'Por favor, complete todos los campos de dirección.', "error").then(() => {
      setTimeout(() => scrollearHasta('opciones-envio'), 200);
    });
    return false;
  }

  const pagoCampos = ['forma_pago', 'tipo_envio'];
  if (!pagoCampos.every(campo => document.getElementById(campo).value)) {
    Swal.fire("Error", 'Por favor, seleccione una forma de pago y un tipo de envío.', "error").then(() => {
      setTimeout(() => scrollearHasta('opciones-compra'), 200);
    });
    return false;
  }

  return true;
}


function mostrarError(mensaje, scrollId) {
  Swal.fire("Error", mensaje, "error").then(() => {
    setTimeout(() => document.getElementById(scrollId).scrollIntoView({ behavior: 'smooth' }), 200);
  });
  return false;
}

// Enviar compra
document.getElementById("opciones-compra").addEventListener("submit", (event) => {
  event.preventDefault();
  if (validarDatosCompra()) {
    Swal.fire("Éxito", "Compra realizada con éxito.", "success").then(() => {
      productos = [];
      localStorage.removeItem("cartItems");
      mostrarProductos();
      document.getElementById("opciones-compra").reset();
    });
  }
});

// Inicializar vista del carrito
mostrarProductos();
document.querySelector("#opciones-compra select:nth-of-type(2)").addEventListener("change", recalcularTotal);

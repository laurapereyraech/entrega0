const FIXER_API_URL = "https://data.fixer.io/api/latest";
const FIXER_API_KEY = "78b5e230cc134cc75d0d7eabf3105e8c";

// Carga inicial de productos desde localStorage
let productos = JSON.parse(localStorage.getItem("cartItems")) || [];
let dolarAPeso = 40; // Valor aproximado por si Fixer falla

// Mostrar productos en el carrito y actualizar cantidades y totales
async function mostrarProductos() {
  document.getElementById("productosSeleccionados").innerHTML = "";
  document.getElementById("tabla").innerHTML = "";
  let totalUSD = 0;
  let totalUYU = 0;
  let totalItems = 0;

  if (!productos.length) {
    actualizarVistaVacia();
  } else {
    productos.forEach((product, index) => {
      const subtotal = product.unitCost * product.count;
      totalItems += product.count;

      if (product.currency === "USD") {
        totalUSD += subtotal;
      } else if (product.currency === "UYU") {
        totalUYU += subtotal;
      }

      agregarFilaTabla(product, index, subtotal);
      agregarCardProducto(product, index);
    });

    const tasaCambio = await obtenerTasaCambio();
    const totalEnPesos = totalUYU + totalUSD * tasaCambio;

    actualizarTotales(totalEnPesos, totalItems, tasaCambio);
  }
}

// Obtener tasa de cambio del dólar
async function obtenerTasaCambio() {
  try {
    const response = await fetch(`${FIXER_API_URL}?access_key=${FIXER_API_KEY}&symbols=USD,UYU`);
    if (response.ok) {
      const data = await response.json();
      const tasa = data.rates.UYU / data.rates.USD;
      return tasa || dolarAPeso;
    } else {
      mostrarAdvertenciaFixer();
    }
  } catch (error) {
    mostrarAdvertenciaFixer();
  }
  return dolarAPeso; // Valor aproximado en caso de error
}

function mostrarAdvertenciaFixer() {
  Swal.fire("Advertencia", "No se pudo obtener la tasa de cambio actual. Se usará un valor aproximado.", "warning");
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
    <td class="text-end">${product.currency} $<span id="subtotal-${index}">${subtotal.toFixed(2)}</span></td>
  `;
  document.getElementById("tabla").appendChild(fila);
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

function actualizarTotales(totalEnPesos, totalItems, tasaCambio) {
  document.getElementById("cantidadProductos").textContent = productos.length;
  document.getElementById("cart-count-badge").textContent = totalItems;
  document.getElementById("total").textContent = `UYU ${totalEnPesos.toFixed(2)}`;
  document.getElementById("moneda").textContent = `Tasa de cambio: 1 USD = ${tasaCambio.toFixed(2)} UYU`;
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
  mostrarProductos(); // Se vuelve a calcular el total
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

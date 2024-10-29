let productos = localStorage.getItem("cartItems");
productos = JSON.parse(productos);

const containerProductos = document.getElementById("productosSeleccionados");
const cantidadProductos = document.getElementById("cantidadProductos");
const tabla = document.getElementById("tabla");
const containerTotal = document.getElementById("total");
const moneda = document.getElementById("moneda");

if (!productos) {
  containerProductos.textContent = "No existen elementos seleccionados";
  cantidadProductos.textContent = 0;
} else {
  let total = 0;
  cantidadProductos.textContent = productos.length;

  productos.forEach((product, index) => {
    // Calcula el subtotal inicial
    const subtotal = product.unitCost * product.count;
    total += subtotal;

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
        <button class="btn btn-danger btn-sm">Eliminar</button>
      </article>
    `;
    containerProductos.appendChild(card);

    // Añadir el evento para actualizar la cantidad en tiempo real
    const quantityInput = card.querySelector(`input[name="cantidad"]`);
    quantityInput.addEventListener("input", (event) => updateQuantity(event, index));
  });

  // Muestra el total inicial
  containerTotal.textContent = `Total: $${total}`;

  // Función para actualizar la cantidad, subtotal y total
  function updateQuantity(event, index) {
    const newQuantity = parseInt(event.target.value);
    productos[index].count = newQuantity;

    // Actualiza el subtotal del producto
    const newSubtotal = productos[index].unitCost * newQuantity;
    document.getElementById(`subtotal-${index}`).textContent = newSubtotal.toFixed(2);
    document.getElementById(`count-${index}`).textContent = newQuantity;

    // Recalcula el total
    const newTotal = productos.reduce((acc, product) => acc + product.unitCost * product.count, 0);
    containerTotal.textContent = `Total: $${newTotal.toFixed(2)}`;

    // Guarda los cambios en localStorage
    localStorage.setItem("cartItems", JSON.stringify(productos));
  }
}

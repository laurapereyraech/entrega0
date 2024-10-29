let productos = localStorage.getItem("cartItems");

productos = JSON.parse(productos);
const containerProductos = document.getElementById("productosSeleccionados");

const cantidadProductos = document.getElementById("cantidadProductos");

if (!productos) {
  containerProductos.textContent = "No existen elementos seleccionados";
  cantidadProductos.textContent = 0;
} else {
  const tabla = document.getElementById("tabla");
  const containerTotal = document.getElementById("total");
  const moneda = document.getElementById("moneda");
  let total = 0;
  cantidadProductos.textContent = productos.length;
  productos.forEach((product) => {
    // Tabla

    const row = document.createElement("tr");
    const subtotal = product.unitCost * product.count;
    total += subtotal;
    row.innerHTML += `
            <tr>
                <td>${product.name} x${product.count}</td>
                <td class="text-end">${subtotal}</td>
            </tr>
        `;
    moneda.textContent += `${product.currency} `;
    tabla.appendChild(row);
		containerTotal.textContent = `Total: $${total}`;

    // Productos

    console.log(product);
    const card = document.createElement("li");
    card.innerHTML = `
		<article class="d-flex my-2 flex-row align-items-center">
			<img
				src=${product.image}
				alt=${product.name}
			/>
			<div class="d-flex flex-column justify-content-between mx-2">
				<h3 class="fs-4 mb-0">${product.name}</h3>
				<p class="mb-0"><span>${product.currency} $</span>${product.unitCost}</p>
			</div>
			<label for="cantidad">x</label>
			<input name="cantidad" type="number" value=${product.count} />
			<button class="btn btn-danger btn-sm">Eliminar</button>
		</article>`;
		containerProductos.appendChild(card)
  });
}

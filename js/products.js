const apiUrl = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

async function getProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data from https://japceibal.github.io/emercado-api/cats_products/101.json: ', error);
    }
}

const productsContainer = document.getElementById('productsContainer');

function mostrarProductos(data) {
    if (!data || !data.products) return;

    for (const producto of data.products) {
        const card = document.createElement('article');
        card.classList.add('card-producto');

        card.innerHTML = `
            <img src="${producto.image}" alt="${producto.name}">
            <div>
                <h4>${producto.name}</h4>
                <p>${producto.soldCount} vendido/s</p>
            </div>
            <p>${producto.currency} ${producto.cost}</p>
            <p>${producto.description}</p>
        `;

        productsContainer.appendChild(card);
    }
}

getProducts().then(data => {
    if (data) {
        mostrarProductos(data);
    }
});

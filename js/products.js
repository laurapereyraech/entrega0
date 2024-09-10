const apiUrl = 'https://japceibal.github.io/emercado-api/cats_products/101.json';



    // Modificación para que el ID de cada producto se guarde en el localstorage a travez de una API
const defaultApiUrl = 'https://japceibal.github.io/emercado-api/cats_products/';

async function getProducts() {
    const categoryId = localStorage.getItem('catID') || '101'; 
    const apiUrl = `${defaultApiUrl}${categoryId}.json`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${apiUrl}: `, error);
    }
}

function mostrarProductos(data) {
    if (!data || !data.products) return;

    for (const producto of data.products) {
        const card = document.createElement('article');
        card.id = producto.id
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

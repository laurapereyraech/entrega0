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

const apiUrl = 'https://japceibal.github.io/emercado-api/cats_products/101.json';
let products = [];

async function getProducts() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('No me pude conectar');
        }
        const data = await response.json();
        products = data.products;
        mostrarProductos(products);
    } catch (error) {
        console.error('No pudo obtener los datos: ', error);
    }
}


function mostrarProductos(products) {
    const productsContainer = document.getElementById('productsContainer');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('col-md-4', 'mb-4');
        card.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text"><small class="text-muted">${product.soldCount} vendido/s</small></p>
                    <p class="card-text"><strong>${product.currency} ${product.cost}</strong></p>
                </div>
            </div>
        `;
        productsContainer.appendChild(card);
    });
}

function filterProducts() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    let filteredProducts = products;

    if (minPrice) {
        filteredProducts = filteredProducts.filter(product => product.cost >= minPrice);
    }
    if (maxPrice) {
        filteredProducts = filteredProducts.filter(product => product.cost <= maxPrice);
    }

    mostrarProductos(filteredProducts);
}

function clearFilters() {
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    mostrarProductos(products);
}

function sortProducts(criteria) {
    let sortedProducts = [...products];

    if (criteria === 'priceAsc') {
        sortedProducts.sort((a, b) => a.cost - b.cost);
    } else if (criteria === 'priceDesc') {
        sortedProducts.sort((a, b) => b.cost - a.cost);
    } else if (criteria === 'relevanceDesc') {
        sortedProducts.sort((a, b) => b.soldCount - a.soldCount);
    }

    mostrarProductos(sortedProducts);
}

getProducts();
prodID = localStorage.getItem('prodID');

const getProductById = async () => {
    try {
        const response = await fetch(`https://japceibal.github.io/emercado-api/products/${prodID}.json`)
        if (!response.ok) {
            throw new Error('Error al traer el producto');
        }
        let product = await response.json();
        displayProductDetail(product)
    } catch (error) {
        alert(error.message);
        window.location = 'products.html';
    }
}

const displayProductDetail = (product) => {
    const productContainer = document.getElementById('product-detail');
    console.log(product)
    productContainer.innerHTML = `
        <h2>${product.name}</h2>
        <img src="${product.images[0]}" alt="${product.name}">
        <img src="${product.images[1]}" alt="${product.name}">
        <img src="${product.images[2]}" alt="${product.name}">
        <img src="${product.images[3]}" alt="${product.name}">
        <p>${product.description}</p>
        <p>Precio: ${product.currency} ${product.cost}</p>
        <p>Vendidos: ${product.soldCount}</p>
        <p>Categoria: ${product.category}</p>
    `;
}

if (!prodID) {
    window.location = 'products.html';
} else {
    getProductById();
}

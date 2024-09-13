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
    productContainer.innerHTML = `
        <picture>
            <img class="first-image" src="${product.images[0]}" alt="${product.name}"></img>
            <div class="rest-images" id="images-${product.id}"></div>
        </picture>
        <div class="product-info">
            <h2>${product.name}</h2>
            <p class="category">Categoria: ${product.category}</p>
            <p>Precio: ${product.currency} ${product.cost}</p>
            <p class="description">${product.description}</p>
            <p>Cantidad de vendidos: ${product.soldCount}</p>
        </div>
    `;

    const imagesContainer = document.getElementById(`images-${product.id}`)
    
    product.images.forEach(img => {
        if (img !== product.images[0]) imagesContainer.innerHTML += `<img src="${img}" alt="${product.name}"></img>`
    });
}

if (!prodID) {
    window.location = 'products.html';
} else {
    getProductById();
}

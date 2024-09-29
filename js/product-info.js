let prodID = localStorage.getItem('prodID');
const apiLink = 'https://japceibal.github.io/emercado-api'
const productContainer = document.getElementById('product-detail');

const getProductById = async () => {
    try {
        const response = await fetch(`${apiLink}/products/${prodID}.json`)
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

const getProductCommentsById = async () => {
    try {
        const response = await fetch(`${apiLink}/products_comments/${prodID}.json`)
        if (!response.ok) {
            throw new Error('Error al traer los comentarios');
        }
        let comments = await response.json();
        displayComments(comments)
    } catch (error) {
        alert(error.message);
    }
}

const generateStars = rating => {
    const totalStars = 5;
    let fullStars = Math.floor(rating);
    const decimalPart = rating % 1; // Parte decimal del rating
  
    // Si el decimal es >= 0.4 y < 0.9, se añade media estrella
    const halfStar = decimalPart >= 0.4 && decimalPart < 0.9 ? 1 : 0;
  
    // Si el decimal es mayor o igual a 0.9, se añade una estrella completa extra
    if (decimalPart >= 0.9) {
      fullStars++;
    }
  
    const emptyStars = totalStars - fullStars - halfStar;
  
    return `${'<i class="bi bi-star-fill"></i>'.repeat(fullStars)}
            ${halfStar ? '<i class="bi bi-star-half"></i>' : ""}
            ${'<i class="bi bi-star"></i>'.repeat(emptyStars)}`;
  };

const displayProductDetail = (product) => {
    const productDetailContainer = document.createElement('section');
    productDetailContainer.classList.add('d-flex');
    productContainer.appendChild(productDetailContainer)
    productDetailContainer.innerHTML = `
        <picture>
            <img class="first-image" src="${product.images[0]}" alt="${product.name}"></img>
            <div class="rest-images" id="images-${product.id}"></div>
        </picture>
        <div class="product-info">
            <h2>${product.name}</h2>
            <p class="category text-muted">${product.category}</p>
            
            <p class="price">${product.currency} ${product.cost}</p>
            <p class="description">${product.description}</p>
            <p class="sold-count">${product.soldCount} vendidos</p>
        </div>
    `;

    const imagesContainer = document.getElementById(`images-${product.id}`)
    
    product.images.forEach(img => {
        if (img !== product.images[0]) imagesContainer.innerHTML += `<img src="${img}" alt="${product.name}"></img>`
    });
}

const displayComments = comments => {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.className ='comments'
    for (const comment of comments) {
        commentsContainer.innerHTML += `
        <div class="comment mt-4">
            <div class="d-flex justify-content-between align-items-center">
                <p class="fs-5 mb-1">${comment.user}</p>
                <p class="mb-1">${comment.dateTime}</p>
            </div>
            <div class="stars d-flex">${generateStars(comment.score)}</div>
            <p class="mt-2 fst-italic">"${comment.description}"</p>
        </div>
        `
    }
}

if (!prodID) {
    window.location = 'products.html';
} else {
    getProductById();
    getProductCommentsById()
}

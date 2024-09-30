let prodID = localStorage.getItem('prodID');
const apiLink = 'https://japceibal.github.io/emercado-api';
const productContainer = document.getElementById('product-detail');

// Función para obtener el producto por ID
const getProductById = async () => {
    try {
        const response = await fetch(`${apiLink}/products/${prodID}.json`);
        if (!response.ok) {
            throw new Error('Error al traer el producto');
        }
        let product = await response.json();
        displayProductDetail(product);
    } catch (error) {
        alert(error.message);
        window.location = 'products.html';
    }
};

// Función para obtener los comentarios del producto por ID
const getProductCommentsById = async () => {
    try {
        const response = await fetch(`${apiLink}/products_comments/${prodID}.json`);
        if (!response.ok) {
            throw new Error('Error al traer los comentarios');
        }
        let comments = await response.json();
        displayComments(comments);
    } catch (error) {
        alert(error.message);
    }
};

// Función para generar las estrellas según la calificación
const generateStars = (rating, isClickable = false) => {
    const totalStars = 5;
    let fullStars = Math.floor(rating);
    const decimalPart = rating % 1;
    const halfStar = decimalPart >= 0.4 && decimalPart < 0.9 ? 1 : 0;

    if (decimalPart >= 0.9) {
        fullStars++;
    }

    let starsHtml = '';
    for (let i = 1; i <= totalStars; i++) {
        if (i <= fullStars) {
            starsHtml += `<i class="bi bi-star-fill" data-value="${i}" style="cursor: ${isClickable ? 'pointer' : 'default'};"></i>`;
        } else if (i === fullStars + 1 && halfStar) {
            starsHtml += `<i class="bi bi-star-half" data-value="${i}" style="cursor: ${isClickable ? 'pointer' : 'default'};"></i>`;
        } else {
            starsHtml += `<i class="bi bi-star" data-value="${i}" style="cursor: ${isClickable ? 'pointer' : 'default'};"></i>`;
        }
    }
    return starsHtml;
};

// Función para mostrar los detalles del producto
const displayProductDetail = (product) => {
    const productDetailContainer = document.createElement('section');
    productDetailContainer.classList.add('d-flex');
    productContainer.appendChild(productDetailContainer);

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

    const imagesContainer = document.getElementById(`images-${product.id}`);
    product.images.forEach(img => {
        if (img !== product.images[0]) imagesContainer.innerHTML += `<img src="${img}" alt="${product.name}"></img>`;
    });
};

// Función para mostrar los comentarios
const displayComments = comments => {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.className = 'comments';

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
        `;
    }

    // Agregar la sección de comentario y calificación
    const commentForm = document.getElementById('comment-form');
    document.getElementById('comment-rating-container').innerHTML = generateStars(0, true); // Generar estrellas iniciales

    const ratingStars = document.querySelectorAll('#comment-rating-container i');
    let selectedCommentRating = 0;

    ratingStars.forEach(star => {
        star.addEventListener('click', (e) => {
            selectedCommentRating = e.target.getAttribute('data-value');
            ratingStars.forEach(s => {
                if (s.getAttribute('data-value') <= selectedCommentRating) {
                    s.classList.replace('bi-star', 'bi-star-fill');
                    s.classList.remove('bi-star-half');
                } else {
                    s.classList.replace('bi-star-fill', 'bi-star');
                    s.classList.remove('bi-star-half');
                }
            });
        });
    });

    commentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        const commentText = document.getElementById('comment').value;
        if (selectedCommentRating > 0 && commentText.trim() !== '') {
            console.log(`Comentario: ${commentText}, Calificación: ${selectedCommentRating}`);
            alert(`Gracias por tu comentario y calificación de ${selectedCommentRating} estrella(s)!`);
            // Aquí puedes agregar la lógica para enviar el comentario y calificación al servidor
        } else {
            alert('Por favor, selecciona una calificación y escribe un comentario antes de enviar.');
        }
    });
};

// Comprobar si hay un ID de producto
if (!prodID) {
    window.location = 'products.html';
} else {
    getProductById();
    getProductCommentsById();
}

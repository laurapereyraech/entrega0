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
    const totalStars = 5; // Total de estrellas a mostrar
    let fullStars = Math.floor(rating); // Número de estrellas llenas
    const decimalPart = rating % 1; // Parte decimal de la calificación
    const halfStar = decimalPart >= 0.4 && decimalPart < 0.9 ? 1 : 0; // Determina si se necesita una media estrella

    // Si el decimal es mayor o igual a 0.9, se añade una estrella completa extra
    if (decimalPart >= 0.9) {
        fullStars++;
    }

    let starsHtml = ''; // Variable para almacenar el HTML de las estrellas
    for (let i = 1; i <= totalStars; i++) {
        // Genera el HTML para las estrellas llenas, medias y vacías
        if (i <= fullStars) {
            // Estrella llena
            starsHtml += `<i class="bi bi-star-fill" data-value="${i}" style="cursor: ${isClickable ? 'pointer' : 'default'};"></i>`;
        } else if (i === fullStars + 1 && halfStar) {
            // Media estrella
            starsHtml += `<i class="bi bi-star-half" data-value="${i}" style="cursor: ${isClickable ? 'pointer' : 'default'};"></i>`;
        } else {
            // Estrella vacía
            starsHtml += `<i class="bi bi-star" data-value="${i}" style="cursor: ${isClickable ? 'pointer' : 'default'};"></i>`;
        }
    }
    return starsHtml; // Retorna el HTML de las estrellas generadas
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
            <div class="rating" id="rating-container">
                ${generateStars(0, true)} <!-- Hacer clickeable -->
            </div>
            <button id="submit-rating" class="btn btn-light mt-2">Enviar Calificación</button>
        </div>
    `;

    const imagesContainer = document.getElementById(`images-${product.id}`);
    product.images.forEach(img => {
        if (img !== product.images[0]) imagesContainer.innerHTML += `<img src="${img}" alt="${product.name}"></img>`;
    });

    // Manejar el clic en las estrellas
    const ratingStars = document.querySelectorAll('#rating-container i');
    let selectedRating = 0; // Almacena la calificación seleccionada

    ratingStars.forEach(star => {
        star.addEventListener('click', (e) => {
            selectedRating = e.target.getAttribute('data-value'); // Captura el valor de la estrella seleccionada

            // Actualiza la visualización de las estrellas
            ratingStars.forEach(s => {
                if (s.getAttribute('data-value') <= selectedRating) {
                    s.classList.replace('bi-star', 'bi-star-fill'); // Estrella llena
                    s.classList.remove('bi-star-half');
                } else {
                    s.classList.replace('bi-star-fill', 'bi-star'); // Estrella vacía
                    s.classList.remove('bi-star-half');
                }
            });
        });
    });

    // Manejar el clic en el botón de enviar calificación
    const submitButton = document.getElementById('submit-rating');
    submitButton.addEventListener('click', () => {
        if (selectedRating > 0) {
            console.log(`Calificación enviada: ${selectedRating}`); // Aquí puedes enviar la calificación al servidor
            alert(`Gracias por tu calificación de ${selectedRating} estrella(s)!`);
        } else {
            alert('Por favor, selecciona una calificación antes de enviar.');
        }
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
};

// Comprobar si hay un ID de producto
if (!prodID) {
    window.location = 'products.html';
} else {
    getProductById();
    getProductCommentsById();
}

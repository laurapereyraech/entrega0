let prodID = localStorage.getItem('prodID'); // Obtener el ID del producto almacenado en localStorage
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
    const totalStars = 5; // Número total de estrellas
    let fullStars = Math.floor(rating); // Estrellas llenas según la parte entera de la calificación
    const decimalPart = rating % 1; // Parte decimal de la calificación
    const halfStar = decimalPart >= 0.4 && decimalPart < 0.9 ? 1 : 0; // Media estrella si está entre 0.4 y 0.9

    // Si la parte decimal es mayor o igual a 0.9, se suma una estrella completa
    if (decimalPart >= 0.9) {
        fullStars++;
    }

    let starsHtml = ''; // Variable para almacenar el HTML de las estrellas
    // Generar el HTML de las estrellas
    for (let i = 1; i <= totalStars; i++) {
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
    return starsHtml; // Retornar el HTML de las estrellas generadas
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

    // Mostrar cada comentario en el contenedor
    for (const comment of comments) {
        commentsContainer.innerHTML += `
        <div class="comment mt-4">
            <div class="d-flex justify-content-between align-items-center">
                <p class="fs-5 mb-1">${comment.user}</p>
                <p class="mb-1">${comment.dateTime}</p>
            </div>
            <div class="stars d-flex">${generateStars(comment.score)}</div> <!-- Mostrar estrellas según la calificación del comentario -->
            <p class="mt-2 fst-italic">"${comment.description}"</p>
        </div>
        `;
    }

    // Agregar la sección de comentario y calificación
    const commentForm = document.getElementById('comment-form');
    document.getElementById('comment-rating-container').innerHTML = generateStars(0, true); // Generar estrellas iniciales (vacías y clickeables)

    const ratingStars = document.querySelectorAll('#comment-rating-container i'); // Seleccionar todas las estrellas generadas
    let selectedCommentRating = 0; // Variable para almacenar la calificación seleccionada

    // Agregar eventos de clic a las estrellas
    ratingStars.forEach(star => {
        star.addEventListener('click', (e) => {
            selectedCommentRating = e.target.getAttribute('data-value'); // Obtener el valor de la estrella clickeada
            ratingStars.forEach(s => {
                // Actualizar las estrellas según la calificación seleccionada
                s.classList.remove('bi-star-fill', 'bi-star-half', 'bi-star');
                s.classList.add(selectedCommentRating >= s.getAttribute('data-value') ? 'bi-star-fill' : 'bi-star');
            });
            // Manejar media estrella
            if (selectedCommentRating > 0 && selectedCommentRating < ratingStars.length) {
                ratingStars[selectedCommentRating].classList.remove('bi-star');
                ratingStars[selectedCommentRating].classList.add('bi-star-half');
            }
        });
    });

    // Evento al enviar el formulario de comentario
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
        const commentText = document.getElementById('comment').value; // Obtener el texto del comentario
        if (selectedCommentRating > 0 && commentText.trim() !== '') {
            console.log(`Comentario: ${commentText}, Calificación: ${selectedCommentRating}`); // Mostrar en consola
            alert(`Gracias por tu comentario y calificación de ${selectedCommentRating} estrella(s)!`); // Mensaje de agradecimiento

            // Crear un objeto de comentario simulado
            const newComment = {
                user: 'Usuario Anónimo', // Puedes cambiarlo por el nombre del usuario si tienes esa información
                dateTime: new Date().toLocaleString(), // Fecha y hora actual
                score: selectedCommentRating,
                description: commentText
            };

            // Mostrar el nuevo comentario en la sección de comentarios
            displayNewComment(newComment);

            // Limpiar el formulario
            commentForm.reset();
            document.getElementById('comment-rating-container').innerHTML = generateStars(0, true); // Reiniciar estrellas
            selectedCommentRating = 0; // Reiniciar calificación seleccionada
        } else {
            alert('Por favor, selecciona una calificación y escribe un comentario antes de enviar.'); // Alerta si falta información
        }
    });
};

// Función para mostrar un nuevo comentario
const displayNewComment = (comment) => {
    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML += `
    <div class="comment mt-4">
        <div class="d-flex justify-content-between align-items-center">
            <p class="fs-5 mb-1">${comment.user}</p>
            <p class="mb-1">${comment.dateTime}</p>
        </div>
        <div class="stars d-flex">${generateStars(comment.score)}</div> <!-- Mostrar estrellas según la calificación del comentario -->
        <p class="mt-2 fst-italic">"${comment.description}"</p>
    </div>
    `;
};

// Inicializar funciones al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    getProductById(); // Llamar a la función para obtener el producto
    await getProductCommentsById(); // Llamar a la función para obtener los comentarios del producto
});
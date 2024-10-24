let prodID = localStorage.getItem('prodID'); // Obtener el ID del producto almacenado en localStorage
const apiLink = 'https://japceibal.github.io/emercado-api';
const productContainer = document.getElementById('product-detail');

// Función para guardar el producto en el carrito
const saveProductToCart = (product) => {
    // Obtenemos el carrito actual del localStorage o inicializamos uno vacío
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Creamos el objeto del producto a guardar
    const productToAdd = {
        id: product.id,
        name: product.name,
        count: 1, // Cantidad inicial
        unitCost: product.cost,
        currency: product.currency,
        image: product.images[0] // Primera imagen del producto
    };

    // Verificamos si el producto ya existe en el carrito
    const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex >= 0) {
        // Si el producto ya existe, incrementamos la cantidad
        cartItems[existingProductIndex].count += 1;
    } else {
        // Si no existe, lo agregamos al array
        cartItems.push(productToAdd);
    }

    // Guardamos el carrito actualizado en localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

// Función para mostrar los productos relacionados
const displayRelatedProducts = (relatedProducts) => {
    const relatedProductsContainer = document.getElementById('related-products-container');
    
    relatedProducts.forEach(product => {
        const card = document.createElement('div');
        card.onclick = () => {
            localStorage.setItem("prodID", product.id);
            window.location = "product-info.html";
        }
        card.classList.add('col-md-4', 'mb-4');
        card.innerHTML = `
            <div class="card text-white bg-dark">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                </div>
            </div>
        `;
        relatedProductsContainer.appendChild(card);       
    });
};

// Función para guardar el ID del producto en localStorage y redirigir a la misma página
const setProductId = (id) => {
    localStorage.setItem('prodID', id);
    window.location = 'product-info.html';
};

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
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message,
            confirmButtonText: "Volver al listado"
          }).then(res => {
            if (res.isConfirmed) {
                window.location = 'products.html';
            }
          })
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
function generateStars(rating, isClickable = false) {
    return Array.from({ length: 5 }, (_, i) => {
        const fullStars = Math.floor(rating);
        const decimalPart = rating % 1;
        const halfStar = decimalPart >= 0.4 && decimalPart < 0.9;

        let className;
        if (i < fullStars) {
            className = 'bi bi-star-fill';
        } else if (i === fullStars && halfStar) {
            className = 'bi bi-star-half';
        } else {
            className = 'bi bi-star';
        }

        return `<i class="${className}" data-value="${i + 1}" style="cursor: ${isClickable ? 'pointer' : 'default'};"></i>`;
    }).join('');
}  

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
            <button id="buyButton" class="btn btn-primary">Comprar</button>
        </div>
    `;

    const imagesContainer = document.getElementById(`images-${product.id}`);
    product.images.forEach(img => {
        if (img !== product.images[0]) imagesContainer.innerHTML += `<img src="${img}" alt="${product.name}"></img>`;
    });

    // Agregamos el evento click al botón de comprar
    document.getElementById('buyButton').addEventListener('click', () => {
        // Guardamos el producto en el carrito
        saveProductToCart(product);
        
        // Mostramos mensaje de éxito
        Swal.fire({
            icon: "success",
            title: "¡Producto agregado al carrito!",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            // Redirigimos al carrito
            window.location.href = 'cart.html';
        });
    });

    if (product.relatedProducts && product.relatedProducts.length > 0) {
        displayRelatedProducts(product.relatedProducts);
    } else {
        console.log('No hay productos relacionados para mostrar.');
    }
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
            <div class="stars d-flex">${generateStars(comment.score)}</div>
            <p class="mt-2 fst-italic">"${comment.description}"</p>
        </div>
        `;
    }

    // Agregar la sección de comentario y calificación
    const commentForm = document.getElementById('comment-form');
    document.getElementById('comment-rating-container').innerHTML = generateStars(0, true);

    const ratingStars = document.querySelectorAll('#comment-rating-container i');
    let selectedCommentRating = 0;

    const feedbackElement = document.getElementById('feedback-calificacion');
    
    // Agregar eventos de clic a las estrellas
    ratingStars.forEach((star, index) => {
        star.addEventListener('click', (e) => {
            selectedCommentRating = parseInt(e.target.getAttribute('data-value'));
            ratingStars.forEach((s, i) => {
                s.classList.remove('bi-star-fill', 'bi-star-half', 'bi-star');
                s.classList.add(selectedCommentRating > i ? 'bi-star-fill' : 'bi-star');
            });
            
            if (selectedCommentRating > 0 && selectedCommentRating < ratingStars.length && e.target.classList.contains('bi-star')) {
                ratingStars[selectedCommentRating].classList.remove('bi-star');
                ratingStars[selectedCommentRating].classList.add('bi-star-half');
            }
            feedbackElement.textContent = `Has seleccionado ${selectedCommentRating} estrellas`;
        });
    })

    // Evento al enviar el formulario de comentario
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const commentText = document.getElementById('comment').value;
        if (selectedCommentRating > 0 && commentText.trim() !== '') {
            Swal.fire({
                icon: "success",
                title: "Calificación agregada correctamente",
                text: `Gracias por tu comentario y tu calificación de ${selectedCommentRating} estrella/s!`
              });

            const newComment = {
                user: 'Usuario Anónimo',
                dateTime: new Date().toLocaleString(),
                score: selectedCommentRating,
                description: commentText
            };

            displayNewComment(newComment);

            commentForm.reset();
            document.getElementById('comment-rating-container').innerHTML = generateStars(0, true);
            selectedCommentRating = 0;
        } else {
            alert('Por favor, selecciona una calificación y escribe un comentario antes de enviar.');
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
        <div class="stars d-flex">${generateStars(comment.score)}</div>
        <p class="mt-2 fst-italic">"${comment.description}"</p>
    </div>
    `;
};

// Inicializar funciones al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    getProductById(); // Llamar a la función para obtener el producto
    await getProductCommentsById(); // Llamar a la función para obtener los comentarios del producto

    // Verifica el modo guardado en localStorage
    const currentMode = localStorage.getItem("theme");
    if (currentMode === "dark") {
        document.body.classList.add("night-mode");
        const modeToggle = document.getElementById("mode-toggle");
        if (modeToggle) {
            modeToggle.textContent = "Modo Día";
        }
    }

    // Cambia entre Modo Día y Modo Noche
    const modeToggle = document.getElementById("mode-toggle");
    if (modeToggle) {
        modeToggle.addEventListener("click", function() {
            document.body.classList.toggle("night-mode");
            if (document.body.classList.contains("night-mode")) {
                modeToggle.textContent = "Modo Día";
                localStorage.setItem("theme", "dark");
            } else {
                modeToggle.textContent = "Modo Noche";
                localStorage.setItem("theme", "light");
            }
        });
    }
});
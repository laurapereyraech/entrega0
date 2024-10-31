const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL =
  "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

let autenticado = localStorage.getItem("auth");

if (!autenticado) window.location.href = "login.html";
else {
  const user = document.getElementById("user");
  user.textContent = localStorage.getItem("auth");
  const cerrarSesion = document.getElementById("cerrarSesion");
  cerrarSesion.addEventListener("click", function () {
    localStorage.removeItem("auth");
    window.location.href = "login.html";
  });
}

const currentMode = localStorage.getItem("theme");
if (currentMode === "dark") {
  document.body.classList.add("night-mode");
}

document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.querySelector(".toggle-dropdown");
  const dropdownMenu = document.querySelector(".dropdown-menu-custom");

  if (toggleButton && dropdownMenu) {
    toggleButton.addEventListener("click", function (event) {
      event.preventDefault();

      if (!dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.add("show"); // Activa el menú inmediatamente

        setTimeout(() => {
          dropdownMenu.classList.add("active"); // Agrega la animación después de activar el menú
        }, 10); // Un pequeño delay para asegurar la transición

      } else {
        dropdownMenu.classList.remove("active"); // Quita la animación
        setTimeout(() => {
          dropdownMenu.classList.remove("show"); // Oculta el menú después de la animación
        }, 300); // Tiempo que coincide con la duración de la animación
      }
    });

    // Opcional: cerrar el menú al hacer clic fuera de él
    document.addEventListener("click", function (e) {
      if (
        !toggleButton.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        dropdownMenu.classList.remove("active");
        setTimeout(() => {
          dropdownMenu.classList.remove("show");
        }, 300);
      }
    });
  }
});

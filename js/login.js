// Función para validar los campos y redireccionar
function validateForm() {
    // Obtener los valores de usuario y contraseña
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value.trim();

    // Validar que ambos campos no estén vacíos
    if (username === "" || password === "") {
        alert("Debe completar todos los campos.");
        return false;  // Evitar que se envíe el formulario
    }

    // Si ambos campos están llenos, redireccionar al sitio de portada
    localStorage.setItem("auth", username);
    window.location.href = "index.html";
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    // Selecciona los elementos del formulario y de la imagen de perfil
    const firstNameInput = document.getElementById('first-name');
    const middleNameInput = document.getElementById('second-name');
    const lastNameInput = document.getElementById('last-name');
    const secondLastNameInput = document.getElementById('second-last-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const profileForm = document.getElementById('profile-form');
    
    const profileImageInput = document.getElementById('profile-image');
    const profileImageDisplay = document.getElementById('profile-image-display');
    const removeImageButton = document.getElementById('remove-image');
    
    // Modal para la imagen de perfil
    const profileImageModal = new bootstrap.Modal(document.getElementById('profileImageModal'));
    const modalProfileImage = document.getElementById('modal-profile-image');
    
    // Mostrar datos al usuario
    const displayFullName = document.getElementById('display-full-name');
    const displayEmail = document.getElementById('display-email');
    const displayPhone = document.getElementById('display-phone');
    
    // Cargar datos del perfil
    function loadProfileData() {
        const profileData = JSON.parse(localStorage.getItem('profileData'));
        if (profileData) {
            firstNameInput.value = profileData.firstName || '';
            middleNameInput.value = profileData.middleName || '';
            lastNameInput.value = profileData.lastName || '';
            secondLastNameInput.value = profileData.secondLastName || '';
            phoneInput.value = profileData.phone || '';
            emailInput.value = profileData.email || '';
            
            // Actualizar la visualización
            updateDisplayData(profileData);
            
            // Cargar imagen de perfil si existe
            if (profileData.profileImage) {
                profileImageDisplay.src = profileData.profileImage;
            }
        }
    }
  
    // Actualizar la visualización de los datos
    function updateDisplayData(data) {
        const fullName = `${data.firstName} ${data.middleName} ${data.lastName} ${data.secondLastName}`.trim();
        displayFullName.textContent = fullName || 'Tus nombres + tus apellidos';
        displayEmail.textContent = data.email || 'Tu email';
        displayPhone.textContent = data.phone || 'Tu teléfono';
    }
  
    // Guardar datos del perfil
    function saveProfileData(profileImage) {
        const profileData = {
            firstName: firstNameInput.value,
            middleName: middleNameInput.value,
            lastName: lastNameInput.value,
            secondLastName: secondLastNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            profileImage: profileImage || localStorage.getItem('profileImage') // Guardar la imagen en localStorage
        };
        localStorage.setItem('profileData', JSON.stringify(profileData));
        updateDisplayData(profileData);
    }
    
    // Validar campos obligatorios
    function validateForm() {
        if (!firstNameInput.value || !lastNameInput.value || !emailInput.value) {
            alert('Por favor, complete todos los campos obligatorios');
            return false;
        }
        return true;
    }
  
    // Convertir la imagen a Base64 y guardarla
    profileImageInput.addEventListener('change', function() {
        const file = profileImageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64Image = reader.result;
                localStorage.setItem('profileImage', base64Image);
                profileImageDisplay.src = base64Image; // Mostrar la imagen cargada
            };
            reader.readAsDataURL(file); // Convertir la imagen a Base64
        }
    });

    // Cargar datos del perfil al cargar la página
    loadProfileData();
    
    // Guardar los datos al enviar el formulario
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            const profileImage = localStorage.getItem('profileImage');
            saveProfileData(profileImage);
            alert('Datos guardados correctamente');
        }
    });
    
    // Mostrar imagen en modal al hacer clic
    profileImageDisplay.addEventListener('click', function() {
        modalProfileImage.src = profileImageDisplay.src; // Asigna la imagen al modal
        profileImageModal.show(); // Muestra el modal
    });

    // Eliminar la imagen de perfil y restaurar la predeterminada
    removeImageButton.addEventListener('click', function() {
        localStorage.removeItem('profileImage'); // Eliminar la imagen de localStorage
        profileImageDisplay.src = 'img/img_perfil.png'; // Restaurar imagen predeterminada
    });

    // Seleccionar el switch de tema
    const themeSwitch = document.getElementById('theme-switch');

    // Función para aplicar el tema
    function applyTheme(theme) {
        document.body.className = theme;
        const navbar = document.querySelector('.navbar');
        navbar.className = `navbar navbar-expand-lg ${theme}`; // Cambia la clase de la barra de navegación
    }

    // Cargar el tema del almacenamiento local o establecer el tema claro por defecto
    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);
    themeSwitch.checked = (currentTheme === 'dark');

    // Evento para cambiar el tema al hacer clic en el switch
    themeSwitch.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme); // Guardar el tema en localStorage
    });
});

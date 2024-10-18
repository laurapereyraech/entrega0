
document.addEventListener('DOMContentLoaded', function() {
    // Selecciona los elementos del formulario
    const firstNameInput = document.getElementById('first-name');
    const middleNameInput = document.getElementById('second-name');
    const lastNameInput = document.getElementById('last-name');
    const secondLastNameInput = document.getElementById('second-last-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const profileForm = document.getElementById('profile-form');
    
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
    function saveProfileData() {
        const profileData = {
            firstName: firstNameInput.value,
            middleName: middleNameInput.value,
            lastName: lastNameInput.value,
            secondLastName: secondLastNameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
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
  
    // Cargar datos del perfil
    loadProfileData();
    
    // guardar los datos
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            saveProfileData();
            alert('Datos guardados correctamente');
        }
    });
  });

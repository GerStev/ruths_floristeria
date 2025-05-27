document.addEventListener('DOMContentLoaded', () => {
    // Verificar estado de autenticación al cargar
    checkAuthStatus();
    
    // Configurar el botón de logout si existe
    document.getElementById('logout-btn')?.addEventListener('click', logoutUser);
});

// Función para verificar y mostrar el estado de autenticación
function checkAuthStatus() {
    const userData = localStorage.getItem('user');
    updateUIBasedOnAuth(!!userData);
}

function updateUIBasedOnAuth(isAuthenticated) {
    // Elementos del header
    const usernameDisplay = document.getElementById('username-display');
    const userIcon = document.getElementById('user-icon');
    const userContainer = document.querySelector('.user-info-container');
    
    // Elementos del menú
    const menuUserInfo = document.getElementById('menu-user-info');
    const menuUsername = document.getElementById('menu-username');
    const loginLinkMenu = document.getElementById('login-link-menu');
    const registerLinkMenu = document.getElementById('register-link-menu');

    if (isAuthenticated) {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Actualizar header
        if (usernameDisplay) usernameDisplay.textContent = user.nombre;
        if (userContainer) userContainer.classList.add('logged-in');
        if (userIcon) {
            userIcon.classList.remove('bi-person-fill');
            userIcon.classList.add('bi-person-check-fill');
        }

        // Actualizar menú
        if (menuUserInfo && menuUsername) {
            menuUsername.textContent = user.nombre;
            menuUserInfo.style.display = 'block';
        }
        if (loginLinkMenu) loginLinkMenu.style.display = 'none';
        if (registerLinkMenu) registerLinkMenu.style.display = 'none';
    } else {
        // Estado invitado
        if (usernameDisplay) usernameDisplay.textContent = '';
        if (userContainer) userContainer.classList.remove('logged-in');
        if (userIcon) {
            userIcon.classList.remove('bi-person-check-fill');
            userIcon.classList.add('bi-person-fill');
        }

        if (menuUserInfo) menuUserInfo.style.display = 'none';
        if (loginLinkMenu) loginLinkMenu.style.display = 'block';
        if (registerLinkMenu) registerLinkMenu.style.display = 'block';
    }
}

// Función para mostrar el estado de "no logueado"
function showLoginState() {
    const usernameDisplay = document.getElementById('username-display');
    const userIcon = document.getElementById('user-icon');
    const userContainer = document.querySelector('.user-info-container');
    const menuUserInfo = document.getElementById('menu-user-info');
    const loginLinkMenu = document.getElementById('login-link-menu');
    
    // Restablecer icono de usuario
    if (userIcon) {
        userIcon.classList.remove('bi-person-check-fill');
        userIcon.classList.add('bi-person-fill');
    }
    
    // Ocultar nombre de usuario
    if (usernameDisplay) usernameDisplay.textContent = '';
    if (userContainer) userContainer.classList.remove('logged-in');
    
    // Restablecer menú de navegación
    if (menuUserInfo) menuUserInfo.style.display = 'none';
    if (loginLinkMenu) loginLinkMenu.style.display = 'block';
    
    // Restablecer enlace
    const userLink = document.querySelector('.user-info-container a');
    if (userLink) userLink.href = '/login';
}

// Función para cerrar sesión
function logoutUser() {
    // Limpiar almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('isLoggedIn');
    
    // Mostrar estado de login
    showLoginState();
    
    // Redirigir a la página principal
    window.location.href = '/index';
}

// Escuchar cambios en el almacenamiento local (para sincronizar entre pestañas)
window.addEventListener('storage', (event) => {
    if (event.key === 'user') {
        checkAuthStatus();
    }
});
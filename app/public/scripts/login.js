document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    // Guardar token y datos de usuario en localStorage y sessionStorage
    const handleAuthSuccess = (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/index';
    };

    // Manejar el evento de inicio de sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showAlert('Por favor, completa todos los campos.', 'error');
            return;
        }

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    Nombre_Usuario: username, 
                    Contraseña: password 
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                handleAuthSuccess(data);
            } else {
                showAlert(data.message || 'Credenciales incorrectas', 'error');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            showAlert('Hubo un error al procesar tu solicitud.', 'error');
        }
    });

    // Manejar el evento de registro
    registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        Nombre_Usuario: document.getElementById('newUsername').value.trim(),
        Correo: document.getElementById('newEmail').value.trim().toLowerCase(),
        Contraseña: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    // Validaciones básicas
    if (!data.Nombre_Usuario || !data.Correo || !data.Contraseña || !data.confirmPassword) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }

    if (data.Contraseña !== data.confirmPassword) {
        showAlert('Las contraseñas no coinciden', 'error');
        return;
    }

    try {
        console.log('Enviando datos de registro al servidor:', {
            Nombre_Usuario: data.Nombre_Usuario,
            Correo: data.Correo,
            Contraseña: '***' // No mostrar contraseña real en logs
        });

        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Nombre_Usuario: data.Nombre_Usuario,
                Correo: data.Correo,
                Contraseña: data.Contraseña
            })
        });

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (!response.ok) {
            throw new Error(result.message || 'Error en el registro');
        }

        showAlert('Registro exitoso! Redirigiendo...', 'success');
        setTimeout(() => window.location.href = '/login', 2000);
        
    } catch (error) {
        console.error('Error en el registro:', error);
        showAlert(error.message, 'error');
    }
});

    // Función para mostrar alertas estilizadas
    function showAlert(message, type) {
        // Eliminar alertas anteriores
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();
        
        const alertBox = document.createElement('div');
        alertBox.className = `alert ${type}`;
        alertBox.textContent = message;
        
        // Insertar antes del formulario correspondiente
        const formContainer = type === 'error' ? 
            (loginForm.contains(document.activeElement) ? loginForm : registerForm) : 
            registerForm;
            
        formContainer.insertBefore(alertBox, formContainer.firstChild);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            alertBox.remove();
        }, 5000);
    }
});
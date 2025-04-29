document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');

    // Manejar el evento de inicio de sesión
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            alert('Por favor, completa todos los campos.');
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
                alert('Inicio de sesión exitoso!');
                window.location.href = '/'; // Redirige a la página principal
            } else {
                alert(data.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un error al procesar tu solicitud.');
        }
    });

    // Manejar el evento de registro
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('newUsername').value;
        const email = document.getElementById('newEmail').value;
        const password = document.getElementById('newPassword').value;

        if (!username || !email || !password) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        // Validación básica de email
        if (!email.includes('@') || !email.includes('.')) {
            alert('Por favor ingresa un correo electrónico válido.');
            return;
        }

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    Nombre_Usuario: username, 
                    Correo: email, 
                    Contraseña: password 
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registro exitoso! Por favor inicia sesión.');
                // Cambia a la vista de login después de registrar
                document.getElementById('login').click();
            } else {
                alert(data.message || 'Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            alert('Hubo un error al procesar tu solicitud.');
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('resetPasswordForm');
    const messageDiv = document.getElementById('message');
    const tokenInput = document.getElementById('token');
    
    // Obtener token de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
        messageDiv.textContent = 'Token no proporcionado';
        messageDiv.className = 'error';
        messageDiv.classList.remove('hidden');
        form.style.display = 'none';
        return;
    }
    
    tokenInput.value = token;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validación de contraseña
        if (newPassword.length < 8) {
            showMessage('La contraseña debe tener al menos 8 caracteres', 'error');
            return;
        }
        
        if (!/[A-Z]/.test(newPassword)) {
            showMessage('La contraseña debe contener al menos una mayúscula', 'error');
            return;
        }
        
        if (!/[0-9]/.test(newPassword)) {
            showMessage('La contraseña debe contener al menos un número', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showMessage('Las contraseñas no coinciden', 'error');
            return;
        }
        
        try {
            const response = await fetch('/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token, 
                    newPassword, 
                    confirmPassword 
                })
            });
            
            const data = await response.json();
            showMessage(data.message, response.ok ? 'success' : 'error');
            
            if (response.ok) {
                setTimeout(() => {
                    window.location.href = '/login';
                }, process.env.PORT);
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Hubo un error al procesar tu solicitud', 'error');
        }
    });
    
    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = type;
        messageDiv.classList.remove('hidden');
    }
});
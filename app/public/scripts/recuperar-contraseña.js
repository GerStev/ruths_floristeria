document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgotPasswordForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        
        try {
            const response = await fetch('/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            messageDiv.textContent = data.message;
            messageDiv.className = response.ok ? 'success' : 'error';
            messageDiv.classList.remove('hidden');
            
            if (response.ok) {
                form.reset();
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Hubo un error al procesar tu solicitud';
            messageDiv.className = 'error';
            messageDiv.classList.remove('hidden');
        }
    });
});
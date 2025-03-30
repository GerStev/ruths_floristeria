document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar algún indicador de carga
        const submitButton = document.querySelector('.btn-enviar');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;
        
        // Recopilar los datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            mensaje: document.getElementById('mensaje').value
        };

        // Verificar que los datos se están capturando correctamente
        console.log("Datos del formulario:", formData);
        
        try {
            // Enviar los datos al servidor
            const response = await fetch('/enviar-formulario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Éxito
                alert('Se ha enviado correctamente. ¡Gracias por contactarnos!');
                contactForm.reset();
            } else {
                // Error
                alert(`Error: ${result.message || 'No se pudo enviar el mensaje. Intente de nuevo más tarde.'}`);
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Ocurrió un error al enviar el mensaje. Por favor, intente nuevamente.');
        } finally {
            // Restaurar el botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});
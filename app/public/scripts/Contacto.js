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
            
            if (response.redirected) {
                // Si el servidor hizo redirect, asumimos éxito
                alert('Se ha enviado correctamente. ¡Gracias por contactarnos!');
                contactForm.reset();

            } else {
                // Si no hubo redirect, procesamos como JSON
                const result = await response.json();
                if (response.ok) {
                    alert('Se ha enviado correctamente. ¡Gracias por contactarnos!');
                    contactForm.reset();
                } else {
                    alert(`Error: ${result.message || 'No se pudo enviar el mensaje. Intente de nuevo más tarde.'}`);
                }
            }
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alert('Ocurrió un error al enviar el mensaje. Por favor, intente nuevamente.');
        }finally {
            // Restaurar el botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
});

// Maneja el despliegue del nav en moviles
const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

// Controla el despliegue del nav y menu en movil
document.addEventListener('DOMContentLoaded', () => {
    const abrirMenu = document.querySelector('.abrir_menu');
    const cerrarMenu = document.querySelector('#cerrar');
    const navMenus = [document.querySelector('#nav'), document.querySelector('#menu_nav')]; // Selecciona ambos IDs

    // Función para abrir el menú
    abrirMenu.addEventListener('click', () => {
        navMenus.forEach(navMenu => {
            if (navMenu) {
                navMenu.classList.add('visible');
            }
        });
    });

    // Función para cerrar el menú
    cerrarMenu.addEventListener('click', () => {
        navMenus.forEach(navMenu => {
            if (navMenu) {
                navMenu.classList.remove('visible');
            }
        });
    });

    // Cerrar el menú al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        navMenus.forEach(navMenu => {
            if (navMenu && !navMenu.contains(event.target) && !abrirMenu.contains(event.target)) {
                navMenu.classList.remove('visible');
            }
        });
    });
});
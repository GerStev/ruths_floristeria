// Alerta personalizada
document.addEventListener('DOMContentLoaded', () => {
    const alertButton = document.getElementById('show-alert1');
    const alertButton2 = document.getElementById('show-alert2');
    const customAlert = document.getElementById('custom-alert');
    const customAlert2 = document.getElementById('custom-alert2');
    const closeAlertButton = document.getElementById('close-alert');
    const closeAlertButton2 = document.getElementById('close-alert2');

    // Mostrar la alerta personalizada
    alertButton.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
        customAlert.classList.remove('hidden-alert');
    });

    alertButton2.addEventListener('click', (e) => {
        e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
        customAlert2.classList.remove('hidden-alert2');
    });

    // Cerrar la alerta personalizada
    closeAlertButton.addEventListener('click', () => {
        customAlert.classList.add('hidden-alert');
    });

    closeAlertButton2.addEventListener('click', () => {
        customAlert2.classList.add('hidden-alert2');
    });
});
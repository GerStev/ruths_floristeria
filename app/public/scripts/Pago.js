// Funcionalidades dinámicas de la página de pago
// Cambiar entre métodos de pago
document.addEventListener('DOMContentLoaded', function() {
    // Cambiar entre métodos de pago
    const paymentMethods = document.querySelectorAll('.method-option');
    const cardDetails = document.getElementById('card-details');
    const bankDetails = document.getElementById('bank-details');
    
    // Inicializar el primer método como activo
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar/ocultar detalles según el método seleccionado
            if (this.dataset.method === 'tarjeta') {
                cardDetails.style.display = 'block';
                bankDetails.style.display = 'none';
            } else {
                cardDetails.style.display = 'none';
                bankDetails.style.display = 'block';
            }
        });
    });
    
    // Formatear número de tarjeta
    const cardNumberInput = document.getElementById('numero-tarjeta');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = value.match(/\d{4,16}/g);
            let match = matches && matches[0] || '';
            let parts = [];
            

            // Formatear el número de tarjeta en grupos de 4 dígitos
            for (let i=0, len=match.length; i<len; i+=4) {
                parts.push(match.substring(i, i+4));
            }
            
            // Actualizar el valor del input con espacios entre grupos de 4 dígitos
            if (parts.length) {
                this.value = parts.join(' ');
            } else {
                this.value = value;
            }
        });
    }
    
    // Validación del formulario
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Validar campos requeridos
            const requiredInputs = this.querySelectorAll('input[required]');
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--warning-color)';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            // Validar número de tarjeta (si es el método seleccionado)
            if (!isValid) {
                e.preventDefault();
                alert('Por favor completa todos los campos requeridos.');
            }
        });
    }
});
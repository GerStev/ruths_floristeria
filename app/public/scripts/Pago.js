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

// Mostrar productos en el carrito en Pago.html
document.addEventListener('DOMContentLoaded', () => {
    const summaryItems = document.querySelector('.summary-items');
    const totalElement = document.querySelector('.summary-total');

    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        let total = 0;

        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.title}</td>
                <td>${item.quantity}</td>
                <td>$${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}</td>
            `;
            summaryItems.appendChild(row);

            total += parseFloat(item.price.slice(1)) * item.quantity;
        });

        totalElement.textContent = `$${total.toFixed(2)}`;
    }
});

// Muestra el total a pagar en el botón de pago
document.addEventListener('DOMContentLoaded', () => {
    const totalElement = document.querySelector('.summary-total');
    const payButtonText = document.querySelector('.btn-pago .btn-text');

    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        let total = 0;

        cartItems.forEach(item => {
            total += parseFloat(item.price.slice(1)) * item.quantity;
        });

            // Actualizar el total en el resumen del pedido
        totalElement.textContent = `$${total.toFixed(2)}`;

        // Actualizar el texto del botón de pago
        payButtonText.textContent = `Pagar $${total.toFixed(2)}`;
    }
});

// Habilitar o deshabilitar campos de destinatario según el checkbox
// Alternar visibilidad de los campos de destinatario
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-destinatario');
    const destinatarioContainer = document.getElementById('destinatario-container');

    toggleButton.addEventListener('click', () => {
        // Alternar la visibilidad del contenedor
        if (destinatarioContainer.style.display === 'none') {
            destinatarioContainer.style.display = 'block';
            toggleButton.textContent = 'Ocultar datos del destinatario';
        } else {
            destinatarioContainer.style.display = 'none';
            toggleButton.textContent = 'Mostrar datos del destinatario';
        }
    });

    // Inicializar el contenedor como visible
    destinatarioContainer.style.display = 'block';
});


// Guardar datos del formulario en localStorage y redirigir a confirmacion-pago.html
document.getElementById('payment-form').addEventListener('submit', (event) => {
    // Prevenir el envío del formulario para manejarlo con JavaScript
    event.preventDefault();

    // Capturar los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('address').value;
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked')?.value;
    const destinatario = document.getElementById('destinatario').value;

    // Verificar que todos los campos tengan valores
    if (!nombre || !email || !telefono || !direccion || !metodoPago || !destinatario ) {
        alert('Por favor, completa todos los campos antes de continuar.');
        return;
    }

    // Guardar los datos en localStorage
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('email', email);
    localStorage.setItem('telefono', telefono);
    localStorage.setItem('direccion', direccion);
    localStorage.setItem('metodoPago', metodoPago);
    localStorage.setItem('destinatario', destinatario);

    // Redirigir a confirmacion-pago.html
    window.location.href = '/confirmacion-pago.html';
});
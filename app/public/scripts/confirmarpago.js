document.addEventListener('DOMContentLoaded', () => {

    // Recuperar los datos de localStorage
    const nombre = localStorage.getItem('nombre') || 'No proporcionado';
    const email = localStorage.getItem('email') || 'No proporcionado';
    const telefono = localStorage.getItem('telefono') || 'No proporcionado';
    const direccion = localStorage.getItem('direccion') || 'No proporcionado';
    const metodoPago = localStorage.getItem('metodoPago') || 'No proporcionado';
    const destinatario = localStorage.getItem('destinatario') || 'No proporcionado';

    // Generar un número de pedido aleatorio
    const orderNumber = `#${Math.floor(100000 + Math.random() * 900000)}`;

    // Fecha actual
    const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Insertar los datos en los elementos correspondientes
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('current-date').textContent = currentDate;
    document.getElementById('nombre').textContent = nombre;
    document.getElementById('email').textContent = email;
    document.getElementById('telefono').textContent = telefono;
    document.getElementById('direccion').textContent = direccion;
    document.getElementById('metodo-pago').textContent = metodoPago;
    document.getElementById('destinatario').textContent = destinatario;
});

document.addEventListener('DOMContentLoaded', () => {
    // Recuperar los datos del carrito desde localStorage
    const savedCart = localStorage.getItem('cart');
    const summaryItems = document.querySelector('.summary-items');
    const totalElement = document.getElementById('total-price');

    if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        let total = 0;

        // Agregar cada producto al resumen del pedido
        cartItems.forEach(item => {
            const itemRow = document.createElement('div');
            itemRow.classList.add('summary-item');
            itemRow.innerHTML = `
                <div class="item-name">${item.title}</div>
                <div class="item-price">$${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}</div>
            `;
            summaryItems.appendChild(itemRow);

            // Calcular el total
            total += parseFloat(item.price.slice(1)) * item.quantity;
        });

        // Mostrar el total en el resumen
        totalElement.textContent = `$${total.toFixed(2)}`;
    } else {
        // Si no hay carrito, mostrar un mensaje vacío
        summaryItems.innerHTML = '<p>No hay productos en el carrito.</p>';
    }
});
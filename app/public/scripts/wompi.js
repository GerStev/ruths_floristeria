
async function pagarConWompi() {
    try {
        const totalPagar = document.querySelector('.total-pagar').innerText.replace('$', '');
        
        if (parseFloat(totalPagar) <= 0) {
            alert('No hay productos en el carrito para pagar');
            return;
        }

        // Obtener productos del carrito
        const cartResponse = await fetch('/api/cart');
        const cartItems = await cartResponse.json();

        // Crear solicitud de pago
        const response = await fetch('/api/create-wompi-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: parseFloat(totalPagar),
                currency: 'USD',
                customerData: {
                    email: 'cliente@ejemplo.com', // Reemplazar con email real o de formulario
                },
                items: cartItems.map(item => ({
                    name: item.title,
                    unit_price: parseFloat(item.price.replace('$', '')),
                    quantity: item.quantity
                }))
            }),
        });

        const data = await response.json();

        if (data.success && data.paymentUrl) {
            window.location.href = data.paymentUrl;
        } else {
            alert(data.message || 'Error al crear el pago. Intente más tarde.');
        }
    } catch (error) {
        console.error('Error en pagarConWompi:', error);
        alert('Ocurrió un error al procesar el pago. Por favor intente nuevamente.');
    }
}
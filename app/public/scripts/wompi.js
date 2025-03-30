async function pagarConWompi() {
    const totalPagar = document.querySelector('.total-pagar').innerText.replace('$', '');
    const response = await fetch('/.netlify/functions/create-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: parseFloat(totalPagar) * 100, // Convertir a centavos
            currency: 'USD',
            reference: 'pedido-12345', // Cambia esto por una referencia única
            customerData: {
                email: 'cliente@ejemplo.com', // Cambia esto por el email del cliente
            },
        }),
    });

    const data = await response.json();

    if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
    } else {
        alert('Error al crear el pago');
    }
}
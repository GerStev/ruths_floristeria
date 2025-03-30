import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/create-payment', async (req, res) => {
    const { amount, currency, reference, customerData } = req.body;

    const response = await fetch('https://sandbox.wompi.sv/api/v1/payments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.WOMPI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount,
            currency,
            reference,
            customerData,
            redirectUrl: 'http://localhost:4000/index', // Cambia esto por tu URL de redirección
        }),
    });

    const data = await response.json();

    if (data.status === 'success') {
        res.json({ paymentUrl: data.data.paymentLink });
    } else {
        res.status(500).json({ error: 'Error al crear el pago' });
    }
});

export default router;
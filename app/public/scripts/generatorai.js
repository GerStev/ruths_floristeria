require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/api/generate-image', async (req, res) => {
    const { prompt } = req.body;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt,
            n: 1,
            size: '512x512',
        }),
    });

    const data = await response.json();
    const imageUrl = data.data[0].url;

    res.json({ imageUrl });
});

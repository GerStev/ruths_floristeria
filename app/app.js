import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import wompiRoutes from './routes/wompi.routes.js';
import axios from 'axios';
import { generarImagen } from './public/scripts/openai.js';

// Cargar variables de entorno
dotenv.config();

// Verificar que la API key está cargada
if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY no está configurada en .env");
    process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();


// Configuraciones
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(wompiRoutes);


// Función para generar el PDF con los datos del formulario
async function generarPDF(datos) {
    return new Promise((resolve, reject) => {
        try {
            const { nombre, email, telefono, mensaje } = datos;
            const fecha = new Date().toLocaleDateString('es-ES');
            const hora = new Date().toLocaleTimeString('es-ES');
            
            // Crear un archivo PDF temporal
            const pdfPath = path.join(__dirname, 'temp', `formulario_${Date.now()}.pdf`);
            
            // Asegurarse de que el directorio temporal existe
            if (!fs.existsSync(path.join(__dirname, 'temp'))) {
                fs.mkdirSync(path.join(__dirname, 'temp'));
            }
            
            // Crear el documento PDF
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(pdfPath);
            
            doc.pipe(stream);
            
            // Añadir logotipo o encabezado del negocio
            doc.fontSize(20).text('Ruth´s Floristeria', { align: 'start' });
            doc.moveDown();
            doc.fontSize(16).text('Formulario de Contacto', { align: 'start' });
            doc.moveDown();
            
            // Añadir los datos del formulario
            doc.fontSize(12).text(`Fecha: ${fecha}`);
            doc.fontSize(12).text(`Hora: ${hora}`);
            doc.moveDown();
            
            doc.fontSize(12).text(`Nombre: ${nombre}`);
            doc.fontSize(12).text(`Email: ${email}`);
            doc.fontSize(12).text(`Teléfono: ${telefono}`);
            doc.moveDown();
            
            doc.fontSize(14).text('Mensaje:');
            doc.fontSize(12).text(mensaje);
            
            // Finalizar el documento
            doc.end();
            
            stream.on('finish', () => {
                resolve(pdfPath);
            });
            
            stream.on('error', (error) => {
                reject(error);
            });
            
        } catch (error) {
            reject(error);
        }
    });
}

// Función para enviar el email con el PDF adjunto
async function enviarEmail(datos, pdfPath) {
    const { nombre, email, telefono, mensaje } = datos;
    
    // Configurar el transporte de correo usando variables de entorno
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true para 465, false para otros puertos
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            // No rechazar certificados inválidos
            rejectUnauthorized: false
        }
    });
    
    // Opciones del correo
    const mailOptions = {
        from: `"Web Ruth´s Floristeria" <${process.env.EMAIL_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: `Nuevo mensaje desde la web de Ruth´s Floristeria`,
        html: `
            <h2>Tienes un nuevo mensaje</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono}</p>
            <h3>Mensaje:</h3>
            <p>${mensaje}</p>
        `,
        attachments: [
            {
                filename: 'formulario.pdf',
                path: pdfPath,
                contentType: 'application/pdf'
            }
        ]
    };
    
    // Verificar la conexión antes de enviar
    try {
        // Verificar la conexión
        await transporter.verify();
        console.log('Conexión al servidor de correo verificada');
        
        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log('Mensaje enviado: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error en la configuración de correo:', error);
        throw error;
    }
}

// Ruta para manejar el envío del formulario de contacto
app.post("/enviar-formulario", async (req, res) => {
    try {
        const { nombre, email, telefono, mensaje } = req.body;

        // Verifica que los datos se estén recibiendo correctamente
        console.log("Datos recibidos:", { nombre, email, telefono, mensaje });

        // Generar el PDF
        const pdfPath = await generarPDF({ nombre, email, telefono, mensaje });

        // Enviar el correo
        await enviarEmail({ nombre, email, telefono, mensaje }, pdfPath);

        // Eliminar el archivo PDF temporal
        fs.unlinkSync(pdfPath);

        // Responder al cliente con JSON en lugar de redirect
        res.json({ success: true, message: 'Se ha enviado correctamente. ¡Gracias por contactarnos!' });

    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        res.status(500).json({ success: false, message: 'Error al procesar el formulario' });
    }
});

// ========================================================================================================================
// Rutas del carrito
let cart = [];

app.post('/api/cart', (req, res) => {
    const { title, price } = req.body;
    const product = cart.find(item => item.title === title);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ title, price, quantity: 1 });
    }
    res.json(cart);
});

app.delete('/api/cart', (req, res) => {
    const { title } = req.body;
    cart = cart.filter(item => item.title !== title);
    res.json(cart);
});

app.get('/api/cart', (req, res) => {
    res.json(cart);
});

// Ruta para crear el pago con Wompi
// Esta ruta es para crear un pago con Wompi en El Salvador
app.post('/api/create-wompi-payment', async (req, res) => {
    try {
        const { amount, currency, reference, customerData, items } = req.body;
        
        // Configuración para Wompi SV
        const wompiApiUrl = 'https://api.wompi.sv/v1/transactions';
        
        const paymentData = {
            amount_in_cents: Math.round(amount * 100), // Convertir a centavos
            currency: currency || 'USD',
            reference: reference || `pedido-${Date.now()}`,
            customer_email: customerData?.email || 'cliente@ejemplo.com',
            payment_method: {
                type: 'CARD' // Puede ser 'NEQUI', 'PSE', etc. según lo que soporte Wompi SV
            },
            items: items.map(item => ({
                name: item.name,
                unit_price: Math.round(item.unit_price),
                quantity: item.quantity
            })),
            // Configuración específica para El Salvador
            country: 'SV',
            redirect_url: `${process.env.BASE_URL}/confirmacion-pago`
        };

        const response = await axios.post(wompiApiUrl, paymentData, {
            headers: {
                'Authorization': `Bearer ${process.env.WOMPI_API_SECRET}`,
                'App-ID': process.env.WOMPI_APP_ID,
                'Content-Type': 'application/json'
            }
        });

        res.json({
            success: true,
            paymentUrl: response.data.data.redirect_url
        });

    } catch (error) {
        console.error('Error en Wompi:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            message: error.response?.data?.message || 'Error al procesar el pago'
        });
    }
});

// confirmación de pago para Wompi
// Webhook para Wompi SV
app.post('/api/wompi-webhook', bodyParser.json(), async (req, res) => {
    try {
        const event = req.body;
        console.log('Webhook recibido:', JSON.stringify(event, null, 2));
        
        // Verifica que sea un evento válido
        if (event.event === 'transaction.updated') {
            const transaction = event.data;
            
            // Procesa según el estado
            switch (transaction.status) {
                case 'APPROVED':
                    console.log('Pago aprobado:', transaction.reference);
                    res.redirect('/confirmacion-pago?status=approved');
                    break;
                case 'DECLINED':
                    console.log('Pago rechazado:', transaction.reference);
                    res.redirect('/confirmacion-pago?status=declined');
                    break;
                case 'VOIDED':
                    console.log('Pago cancelado:', transaction.reference);
                    res.redirect('/confirmacion-pago?status=voided');
                    break;
                default:
                    console.log('Estado desconocido:', transaction.status);
                    res.status(400).json({ error: 'Estado desconocido' });
            }
        }
        
        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Error en webhook:', error);
        res.status(500).json({ error: 'Error procesando webhook' });
    }
});

// Ruta para la confirmación de pago html
// Esta ruta es para la confirmación de pago con Wompi en El Salvador
app.get("/confirmacion-pago", (req, res) => {
    res.sendFile(__dirname + "/views/confirmacion-pago.html");
});


// Ruta para manejar la generación de imágenes
app.post("/generar-imagen", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt inválido o faltante" });
    }

    try {
        const imageUrl = await generarImagen(prompt);

        if (imageUrl) {
            res.json({ imageUrl });
        } else {
            res.status(500).json({ error: "No se pudo generar la imagen." });
        }
    } catch (error) {
        console.error("Error en la generación de imagen:", error);
        res.status(500).json({ 
            error: "Error interno del servidor",
            details: error.message 
        });
    }
});

// ===============================================================================================================================================================================
// Otras rutas
app.get("/", (req, res) => {res.sendFile(__dirname + "/views/index.html");});
app.get("/index", (req, res) => {res.sendFile(__dirname + "/views/index.html");});
app.get("/catalogo", (req, res) => {res.sendFile(__dirname + "/views/catalogo.html");});
app.get("/contacto", (req, res) => {res.sendFile(__dirname + "/views/contacto.html");});
app.get("/nosotros", (req, res) => {res.sendFile(__dirname + "/views/nosotros.html");});
app.get("/personaliza", (req, res) => {res.sendFile(__dirname + "/views/personaliza.html");});
app.get("/confirmar-pago", (req, res) => {res.sendFile(__dirname + "/views/confirmacion-pago.html");});
app.get("/carrito", (req, res) => {res.sendFile(__dirname + "/views/carrito.html");});
app.get("/login", (req, res) => {res.sendFile(__dirname + "/views/login.html");});

// Iniciar el servidor
// Usar el puerto definido en el archivo .env o el puerto proporcionado por Render
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Servidor iniciado en el puerto: " + PORT);
});

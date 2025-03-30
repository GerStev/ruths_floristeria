import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import wompiRoutes from './routes/wompi.routes.js';


// Cargar variables de entorno
dotenv.config();

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
            <h2>Nuevo mensaje</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
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

        // Responder al cliente
        res.redirect('/contacto');
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        res.status(500).json({ success: false, message: 'Error al procesar el formulario' });
    }
});

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

// Ruta para manejar la generación de imágenes
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

// Otras rutas
app.get("/", (req, res) => {res.sendFile(__dirname + "/Paginas/index.html");});
app.get("/index", (req, res) => {res.sendFile(__dirname + "/Paginas/index.html");});
app.get("/catalogo", (req, res) => {res.sendFile(__dirname + "/Paginas/catalogo.html");});
app.get("/contacto", (req, res) => {res.sendFile(__dirname + "/Paginas/contacto.html");});
app.get("/nosotros", (req, res) => {res.sendFile(__dirname + "/Paginas/nosotros.html");});
app.get("/personaliza", (req, res) => {res.sendFile(__dirname + "/Paginas/personaliza.html");});
app.get("/carrito", (req, res) => {res.sendFile(__dirname + "/Paginas/carrito.html");});
app.get("/register", (req, res) => {res.sendFile(__dirname + "/Paginas/register.html");});
app.get("/login", (req, res) => {res.sendFile(__dirname + "/Paginas/login.html");});

// Iniciar el servidor
// Usar el puerto definido en el archivo .env o el puerto proporcionado por Render
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Servidor iniciado en el puerto: " + PORT);
});

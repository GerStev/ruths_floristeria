import express from 'express';
import path from 'path'; 
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { generarImagen } from './public/scripts/openai.js';
import authRoutes from './routes/authRoutes.js';
import jwt from 'jsonwebtoken';
import { getConnection, closePool  } from './database/connectionMysql.js';



// Cargar variables de entorno
dotenv.config();

// Verificar que la API key está cargada
if (!process.env.OPENAI_API_KEY) {
    console.error("ERROR: OPENAI_API_KEY no está configurada en .env");
    process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Verificación de conexión al iniciar
(async () => {
    try {
        const conn = await getConnection();
        console.log('✅ Conexión a MySQL verificada en app.js');
        conn.release(); // Liberar la conexión al pool en lugar de cerrarla
    } catch (error) {
        console.error('❌ No se pudo conectar a MySQL:', error);
        process.exit(1);
    }
})();

// Manejar cierre adecuado del servidor
process.on('SIGINT', async () => {
    await closePool();
    process.exit();
});

process.on('SIGTERM', async () => {
    await closePool();
    process.exit();
});

// Configuraciones
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/auth', authRoutes);



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

// Middleware mejorado en app.js
app.use((req, res, next) => {
    const publicPaths = [
        '/auth/register',
        '/auth/login',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/public',
        '/css',
        '/js',
        '/images',
        '/index'
    ];

    if (publicPaths.some(path => req.path.startsWith(path))) {
        return next();
    }

    try {
        // Obtener token de varias formas posibles
        let token;
        
        // 1. Intentar desde headers Authorization
        if (req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        } 
        // 2. Intentar desde cookies
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // 3. Intentar desde query parameters (útil para pruebas)
        else if (req.query.token) {
            token = req.query.token;
        }

        if (!token) {
            // Si es una API, responder con JSON
            if (req.path.startsWith('/api')) {
                return res.status(401).json({ message: 'Acceso no autorizado' });
            }
            // Si es una ruta de vista, redirigir al login
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error en autenticación JWT:', error);
        
        // Manejar diferentes tipos de errores
        if (error.name === 'TokenExpiredError') {
            if (req.path.startsWith('/api')) {
                return res.status(401).json({ message: 'Token expirado' });
            }
            return res.redirect('/login?error=token-expired');
        }
        
        if (req.path.startsWith('/api')) {
            return res.status(401).json({ message: 'Token inválido' });
        }
        return res.redirect('/login?error=invalid-token');
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
app.get("/pago", (req, res) => {res.sendFile(__dirname + "/views/Pago.html");});
app.get("/confirmarP", (req, res) => {res.sendFile(__dirname + "/views/confirmacion-pago.html");});
app.get("/carrito", (req, res) => {res.sendFile(__dirname + "/views/carrito.html");});
app.get("/login", (req, res) => {res.sendFile(__dirname + "/views/login.html");});

app.get("/recuperar-pass", (req, res) => { res.sendFile(__dirname + "/views/recuperar-contraseña.html");});

app.get("/cambiar-pass", (req, res) => {
    res.sendFile(__dirname + "/views/cambiar-contraseña.html");
});


// Iniciar el servidor
// Usar el puerto definido en el archivo .env o el puerto proporcionado por Render
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Servidor iniciado en el puerto: " + PORT);
});

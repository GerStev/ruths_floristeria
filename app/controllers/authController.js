import { getConnection } from '../database/connectionMysql.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Importar nodemailer y PDFDocument
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configuración JWT (agrégalo a tu .env)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';


export const registerUser = async (req, res) => {
    const { Nombre_Usuario, Correo, Contraseña } = req.body;

    // 1. LOG DE DATOS RECIBIDOS (al inicio de la función)
    console.log("Step1_Datos recibidos para registro:", { 
        Nombre_Usuario, 
        Correo, 
        Contraseña: Contraseña ? '***' : 'undefined' // Oculta la contraseña real
    }); 

    // Validaciones mejoradas
    const errors = [];

    // Verificar si los campos están vacíos
    if (!Nombre_Usuario || !Correo || !Contraseña) {
        errors.push('Todos los campos son obligatorios');
    }

    // Verificar si el nombre de usuario tiene caracteres especiales
    if (Nombre_Usuario && (Nombre_Usuario.length < 4 || Nombre_Usuario.length > 20)) {
        errors.push('El nombre de usuario debe tener entre 4 y 20 caracteres');
    }

    // Verificar si el nombre de usuario contiene caracteres especiales
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (Correo && !emailRegex.test(Correo)) {
        errors.push('El formato del correo electrónico es inválido');
    }

    // Verificar si el correo ya está en uso
    if (Contraseña && Contraseña.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    // Verificar si la contraseña contiene al menos una letra mayúscula
    if (Contraseña && !/[A-Z]/.test(Contraseña)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    // Verificar si la contraseña contiene al menos un número
    if (Contraseña && !/[0-9]/.test(Contraseña)) {
        errors.push('La contraseña debe contener al menos un número');
    }

    // Verificar si las contraseñas coinciden
    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Errores de validación',
            errors
        });
    }

    // Verificar si el correo tiene un formato válido
    try {
    const connection = await getConnection();
    
    // 2. LOG DE CONEXIÓN (después de obtener conexión)
        console.log("Step2_Conexión a DB establecida");

    // Verificar si el usuario ya existe
    const [userExists] = await connection.execute(
        'SELECT * FROM usuarios WHERE nombre = ? OR correo = ?', 
        [Nombre_Usuario, Correo]
    );

    // Si el usuario ya existe, devolver un error
    if (userExists.length > 0) {
        return res.status(400).json({ 
            success: false,
            message: 'El nombre de usuario o correo ya está en uso' 
        });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Contraseña, salt);

    // Insertar nuevo usuario
    const [result] = await connection.execute(
        'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)',
        [Nombre_Usuario, Correo, hashedPassword]
    );

    // 3. LOG DE REGISTRO EXITOSO (después de la inserción)
        console.log("Step3_Usuario registrado con ID:", result.insertId);
        console.log("Datos guardados en DB:", {
            id: result.insertId,
            nombre: Nombre_Usuario,
            correo: Correo,
            contraseña: '***' // Nunca loguees contraseñas reales
        });
    
    // Generar token JWT
    const token = jwt.sign(
        { id: result.insertId, nombre: Nombre_Usuario },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    // Enviar respuesta al cliente
    res.status(201).json({ 
        success: true,
        message: 'Usuario registrado exitosamente',
        token,
        user: {
            id: result.insertId,
            nombre: Nombre_Usuario,
            correo: Correo
        }
    });
    // Cerrar conexión
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al registrar el usuario',
            error: error.message 
        });
    }
};

// Función para iniciar sesión
export const loginUser = async (req, res) => {
    const { Nombre_Usuario, Contraseña } = req.body;
    // Validaciones mejoradas
    if (!Nombre_Usuario || !Contraseña) {
        return res.status(400).json({ 
            success: false,
            message: 'Todos los campos son obligatorios' 
        });
    }
    // Verificar si el nombre de usuario tiene caracteres especiales
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE nombre = ?', 
            [Nombre_Usuario]
        );
        // Verificar si el usuario existe
        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }
        // Verificar si la contraseña es correcta
        const user = rows[0];
        const isMatch = await bcrypt.compare(Contraseña, user.contraseña);
        // Si la contraseña no coincide, devolver un error
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Contraseña incorrecta' 
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, nombre: user.nombre },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Enviar respuesta al cliente
        res.status(200).json({ 
            success: true,
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                correo: user.correo
            }
        });
        // Cerrar conexión
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message 
        });
    }
};



// Configuración del transporter de correo (debe ir en tu .env)
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
// Función para enviar el correo de recuperación de contraseña
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // Validaciones mejoradas
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'El correo electrónico es requerido'
        });
    }
    
    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE correo = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No existe una cuenta con ese correo electrónico'
            });
        }

        const user = rows[0];
        
        // Generar token y fecha de expiración (1 hora)
        const token = crypto.randomBytes(20).toString('hex');
        const expiryDate = new Date(Date.now() + 3600000); // 1 hora

        await connection.execute(
            'UPDATE usuarios SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
            [token, expiryDate, user.id]
        );

        // Enviar correo electrónico
        const resetUrl = `${process.env.FRONTEND_URL}/forgot-password?token=${token}`;
        
        const mailOptions = {
            to: user.correo,
            from: process.env.EMAIL_USER,
            subject: 'Restablecimiento de contraseña',
            html: `
                <p>Has solicitado restablecer tu contraseña.</p>
                <p>Por favor haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña'
        });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la solicitud',
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Token y nueva contraseña son requeridos'
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Las contraseñas no coinciden'
        });
    }

    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM usuarios WHERE reset_token = ? AND reset_token_expiry > NOW()',
            [token]
        );

        if (rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El token es inválido o ha expirado'
            });
        }

        const user = rows[0];
        
        // Encriptar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar contraseña y limpiar token
        await connection.execute(
            'UPDATE usuarios SET contraseña = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
            [hashedPassword, user.id]
        );

        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Error al restablecer la contraseña',
            error: error.message
        });
    }
};
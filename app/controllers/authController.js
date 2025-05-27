import { getConnection } from '../database/conPostgres.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// encripta la contraseña
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Configuración de seguridad
const SALT_ROUNDS = 12; // Coste del hashing (más alto = más seguro pero más lento)
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_super_seguro';

export const registerUser = async (req, res) => {
    const { Nombre_Usuario, Correo, Contraseña } = req.body;

    // Validaciones mejoradas
    const errors = [];
    
    if (!Nombre_Usuario || !Correo || !Contraseña) {
        errors.push('Todos los campos son obligatorios');
    }

    if (Nombre_Usuario && (Nombre_Usuario.length < 4 || Nombre_Usuario.length > 20)) {
        errors.push('El nombre de usuario debe tener entre 4 y 20 caracteres');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (Correo && !emailRegex.test(Correo)) {
        errors.push('El formato del correo electrónico es inválido');
    }

    if (Contraseña && Contraseña.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (Contraseña && !/[A-Z]/.test(Contraseña)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (Contraseña && !/[0-9]/.test(Contraseña)) {
        errors.push('La contraseña debe contener al menos un número');
    }

    if (errors.length > 0) {
        return res.status(400).json({ 
            success: false,
            message: 'Errores de validación',
            errors
        });
    }

    try {
        const connection = await getConnection();
        
        // Verificar si el usuario ya existe
        const { rows: userExists } = await connection.query(
            'SELECT * FROM usuarios WHERE nombre = $1 OR correo = $2', 
            [Nombre_Usuario, Correo]
        );

        if (userExists.length > 0) {
            await connection.release();
            return res.status(400).json({ 
                success: false,
                message: 'El nombre de usuario o correo ya está en uso' 
            });
        }

        // Encriptar contraseña con bcrypt
        const hashedPassword = await bcrypt.hash(Contraseña, SALT_ROUNDS);

        // Insertar nuevo usuario con contraseña hasheada
        const { rows: [newUser] } = await connection.query(
            'INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING id, nombre, correo',
            [Nombre_Usuario, Correo, hashedPassword]
        );

        await connection.release();

        // Generar token JWT
        const token = jwt.sign(
            { id: newUser.id, nombre: newUser.nombre },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ 
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: newUser.id,
                nombre: newUser.nombre,
                correo: newUser.correo
            }
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al registrar el usuario',
            error: error.message 
        });
    }
};

export const loginUser = async (req, res) => {
    const { Nombre_Usuario, Contraseña } = req.body;
    
    if (!Nombre_Usuario || !Contraseña) {
        return res.status(400).json({ 
            success: false,
            message: 'Todos los campos son obligatorios' 
        });
    }

    try {
        const connection = await getConnection();
        const { rows } = await connection.query(
            'SELECT * FROM usuarios WHERE nombre = $1', 
            [Nombre_Usuario]
        );
        
        await connection.release();

        if (rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }

        const user = rows[0];
        
        // Comparar contraseña hasheada
        const isMatch = await bcrypt.compare(Contraseña, user.contraseña);
        
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
        const { rows } = await connection.query(
            'SELECT * FROM usuarios WHERE correo = $1',
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

        await connection.query(
            'UPDATE usuarios SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
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
        const { rows } = await connection.query(
            'SELECT * FROM usuarios WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [token]
        );

        if (rows.length === 0) {
            await connection.release();
            return res.status(400).json({
                success: false,
                message: 'El token es inválido o ha expirado'
            });
        }

        const user = rows[0];
        
        // Encriptar nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Actualizar contraseña y limpiar token
        await connection.query(
            'UPDATE usuarios SET contraseña = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
            [hashedPassword, user.id]
        );

        await connection.release();

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
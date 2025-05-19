import { getConnection } from '../database/connectionMysql.js';

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    const { Nombre_Usuario, Correo, Contraseña } = req.body;

    if (!Nombre_Usuario || !Correo || !Contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const connection = await getConnection();
        
        // Verificar si el usuario ya existe
        const [userExists] = await connection.execute(
            'SELECT * FROM usuarios WHERE nombre = ? OR correo = ?', 
            [Nombre_Usuario, Correo]
        );

        if (userExists.length > 0) {
            return res.status(400).json({ 
                message: 'El nombre de usuario o correo ya está en uso' 
            });
        }

        // Insertar nuevo usuario
        const query = 'INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)';
        await connection.execute(query, [Nombre_Usuario, Correo, Contraseña]);
        
        res.status(201).json({ 
            success: true,
            message: 'Usuario registrado exitosamente' 
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

// Iniciar sesión
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
        const query = 'SELECT * FROM usuarios WHERE nombre = ? AND contraseña = ?';
        const [rows] = await connection.execute(query, [Nombre_Usuario, Contraseña]);

        if (rows.length > 0) {
            res.status(200).json({ 
                success: true,
                message: 'Inicio de sesión exitoso',
                user: {
                    id: rows[0].id,
                    nombre: rows[0].nombre,
                    correo: rows[0].correo
                }
            });
        } else {
            res.status(401).json({ 
                success: false,
                message: 'Usuario o contraseña incorrectos' 
            });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message 
        });
    }
};
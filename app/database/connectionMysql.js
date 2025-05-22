import mysql from 'mysql2/promise';
import config from '../public/config.js';

const dbSettings = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Crear pool de conexiones en lugar de una conexión única
const pool = mysql.createPool(dbSettings);

// Variable para controlar el intervalo de ping
let pingInterval;

export async function getConnection() {
    try {
        // Obtener conexión del pool
        const conn = await pool.getConnection();
        
        // Configurar intervalo de ping solo si no existe
        if (!pingInterval) {
            pingInterval = setInterval(async () => {
                try {
                    // Usar una nueva conexión del pool para el ping
                    const pingConn = await pool.getConnection();
                    await pingConn.ping();
                    pingConn.release(); // Liberar la conexión
                } catch (error) {
                    console.error('Error en ping a MySQL:', error);
                }
            }, 30000); // Cada 30 segundos
        }

        console.log('✅ Conexión obtenida del pool');
        return conn;
    } catch (error) {
        console.error('❌ Error al obtener conexión:', error);
        throw error;
    }
}

// Función para cerrar el pool adecuadamente
export async function closePool() {
    clearInterval(pingInterval);
    await pool.end();
    console.log('Pool de MySQL cerrado correctamente');
}

export { pool };
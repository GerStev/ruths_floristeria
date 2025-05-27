import pg from 'pg';
import config from '../public/config.js';

// Configuración del pool de PostgreSQL
const pool = new pg.Pool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.portPG || 5432, // Puerto por defecto de PostgreSQL
  ssl: {
    rejectUnauthorized: false // Necesario para Render PostgreSQL
  }
});

// Variable para controlar el intervalo de ping
let pingInterval;

export async function getConnection() {
    try {
        // Obtener conexión del pool
        const client = await pool.connect();
        
        // Configurar intervalo de ping solo si no existe
        if (!pingInterval) {
            pingInterval = setInterval(async () => {
                try {
                    // Usar una nueva conexión del pool para el ping
                    const pingClient = await pool.connect();
                    await pingClient.query('SELECT 1');
                    pingClient.release(); // Liberar la conexión
                } catch (error) {
                    console.error('Error en ping a PostgreSQL:', error);
                }
            }, 30000); // Cada 30 segundos
        }

        console.log('✅ Conexión obtenida del pool');
        return client;
    } catch (error) {
        console.error('❌ Error al obtener conexión:', error);
        throw error;
    }
}

// Función para cerrar el pool adecuadamente
export async function closePool() {
    clearInterval(pingInterval);
    await pool.end();
    console.log('Pool de PostgreSQL cerrado correctamente');
}

export { pool };
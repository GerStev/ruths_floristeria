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

export async function getConnection() {
    try {
        const connection = await mysql.createConnection(dbSettings);
        console.log('Conexión exitosa a la base de datos MySQL');
        return connection;
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        throw error;
    }
}

export { mysql };
import { getConnection } from './connectionMysql.js';

async function testConnection() {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('Resultado de prueba:', rows);
        connection.end();
    } catch (error) {
        console.error('Error al probar la conexión:', error);
    }
}

testConnection();
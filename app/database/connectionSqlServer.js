import sql from 'mssql';
import config from '../public/config.js';

const dbSettings = {
    user: config.user,
    password: config.password,
    server: config.host,
    database: config.database,
    options: {
        encrypt: true, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    }
};

export async function getConnection() {
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.error(error);
    }
}

export { sql };
import { getConnection } from './conPostgres.js';

async function testConnection() {
    console.log("Iniciando pruebas de conexión a PostgreSQL...");
    
    // 1. Prueba de conexión básica
    console.log("\n1. Probando conexión básica...");
    try {
        const connection = await getConnection();
        console.log("✅ Conexión exitosa");
        await connection.release(); // Cambiar end() por release()
    } catch (error) {
        console.error("❌ Error en conexión básica:", error.message);
        return;
    }

    // 2. Prueba de consulta a la tabla de usuarios
    console.log("\n2. Probando consulta a usuarios...");
    try {
        const connection = await getConnection();
        const { rows } = await connection.query("SELECT * FROM usuarios LIMIT 2");
        
        if (rows.length > 1) {
            console.log("✅ Consulta exitosa. Primer usuario encontrado:", rows[0]);
        } else {
            console.log("⚠️ La tabla usuarios está vacía");
        }
        
        await connection.release();
    } catch (error) {
        console.error("❌ Error en consulta a usuarios:", error.message);
    }

    // 3. Prueba de consulta con error para ver manejo
    console.log("\n3. Probando consulta con error...");
    try {
        const connection = await getConnection();
        await connection.query("SELECT * FROM tabla_inexistente");
        await connection.release();
    } catch (error) {
        console.log("✅ Correcto - El sistema detectó el error:", error.message);
    }

    // 4. Prueba de inserción (opcional)
    console.log("\n4. Probando inserción...");
    try {
        const connection = await getConnection();
        const { rows } = await connection.query(
            "INSERT INTO usuarios (nombre, correo, contraseña) VALUES ($1, $2, $3) RETURNING id",
            ["test_user12", "test_email12", "test_password12"]
        );
        console.log("✅ Inserción exitosa. ID:", rows[0].id);
        await connection.release();
    } catch (error) {
        console.error("❌ Error en inserción:", error.message);
    }

    console.log("\nPruebas completadas!");
}

// Ejecutar las pruebas
testConnection().catch(err => console.error("Error en las pruebas:", err));
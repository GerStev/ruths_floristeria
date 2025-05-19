import { getConnection } from './connectionMysql.js';

async function testConnection() {
    console.log("Iniciando pruebas de conexión a MySQL...");
    
    // 1. Prueba de conexión básica
    console.log("\n1. Probando conexión básica...");
    try {
        const connection = await getConnection();
        console.log("✅ Conexión exitosa");
        await connection.end();
    } catch (error) {
        console.error("❌ Error en conexión básica:", error.message);
        return;
    }

    // 2. Prueba de consulta a la tabla de usuarios
    console.log("\n2. Probando consulta a t_usuarios...");
    try {
        const connection = await getConnection();
        const [rows] = await connection.query("SELECT * FROM usuarios LIMIT 2");
        
        if (rows.length > 1) {
            console.log("✅ Consulta exitosa. Primer usuario encontrado:", rows[0]);
        } else {
            console.log("⚠️ La tabla t_usuarios está vacía");
        }
        
        await connection.end();
    } catch (error) {
        console.error("❌ Error en consulta a t_usuarios:", error.message);
    }

    // 3. Prueba de consulta con error para ver manejo
    console.log("\n3. Probando consulta con error...");
    try {
        const connection = await getConnection();
        await connection.query("SELECT * FROM tabla_inexistente");
        await connection.end();
    } catch (error) {
        console.log("✅ Correcto - El sistema detectó el error:", error.message);
    }

    // 4. Prueba de inserción (opcional)
    console.log("\n4. Probando inserción...");
    try {
        const connection = await getConnection();
        const [result] = await connection.query(
            "INSERT INTO t_usuarios (Nombre_Usuario, Contraseña) VALUES (?, ?)",
            ["test_user", "test_password"]
        );
        console.log("✅ Inserción exitosa. ID:", result.insertId);
        await connection.end();
    } catch (error) {
        console.error("❌ Error en inserción:", error.message);
    }

    console.log("\nPruebas completadas!");
}

// Ejecutar las pruebas
testConnection().catch(err => console.error("Error en las pruebas:", err));
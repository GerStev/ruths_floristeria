import { getConnection } from './connectionMysql.js';

const getUsuarios = async () => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.query("SELECT id_login, Nombre_Usuario, Contraseña FROM t_usuarios");
        console.table(rows);
        console.log("Usuarios encontrados!");
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
    } finally {
        if (connection) {
            await connection.end(); // Cierra la conexión
        }
    }
};

getUsuarios();
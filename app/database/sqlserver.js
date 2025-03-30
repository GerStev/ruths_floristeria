//importacion de objetos
import { getConnection, sql } from './connectionSqlServer.js';

const getUsuarios = async () => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT id_login, Nombre_Usuario, Contraseña FROM t_usuarios");
        console.table(result.recordset);
        console.log("Usuarios encontrados!");
    } catch (error) {
        console.error(error);
    }
};

getUsuarios();
import { config } from "dotenv";

config(); // Muestra qué variables de entorno se están cargando

export default {
    host: process.env.HOST,
    database: process.env.DATABASE || "ruths_floristeria",
    user: process.env.USER || "admin",
    password: process.env.PASSWORD ,
    portPG: process.env.PORT_PG || 5432,
};
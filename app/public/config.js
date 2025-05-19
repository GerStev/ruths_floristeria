import { config } from "dotenv";

config({ debug: true }); // Muestra qué variables de entorno se están cargando

export default {
    host: process.env.HOST || "localhost",
    database: process.env.DATABASE || "ruths_floristeria",
    user: process.env.USER || "admin",
    password: process.env.PASSWORD || "Admin2022"
};
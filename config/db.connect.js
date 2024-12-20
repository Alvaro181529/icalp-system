import dotenv from 'dotenv';
dotenv.config();
import mysql from 'mysql';
import { promisify } from 'util';

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
});

pool.getConnection((error, connection) => {
    if (error) {
        // Manejo de errores detallado
        if (error.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Conexión cerrada a la base de datos");
        } else if (error.code === "ER_CON_COUNT_ERROR") {
            console.error("La base de datos ha tenido demasiadas conexiones");
        } else if (error.code === "ECONNREFUSED") {
            console.error("La conexión a la base de datos fue rechazada");
        } else {
            console.error(`Error al conectar con la base de datos: ${error.message}`);
        }
    }

    if (connection) {
        console.log("Conexión a la base de datos exitosa");
        connection.release();
    }

});

pool.query = promisify(pool.query);
export default pool;

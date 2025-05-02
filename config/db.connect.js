const mysql = require('mysql');
const dotenv = require('dotenv');
const { promisify } = require('util');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATABASE,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT_DB,
});

pool.getConnection((error, connection) => {
  if (error) {
    // Manejo de errores detallado
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Conexión cerrada a la base de datos');
    } else if (error.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de datos ha tenido demasiadas conexiones');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('La conexión a la base de datos fue rechazada');
    } else {
      console.error(`Error al conectar con la base de datos: ${error.message}`);
    }
  }

  if (connection) {
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  }
});

// Promisificar la función query
pool.query = promisify(pool.query);

module.exports = pool;

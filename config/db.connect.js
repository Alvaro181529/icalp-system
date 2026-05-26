const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER_DATABASE,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verificar conexión al iniciar
pool.getConnection((error, connection) => {
  if (error) {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Conexión cerrada a la base de datos');
    } else if (error.code === 'ER_CON_COUNT_ERROR') {
      console.error('La base de datos ha tenido demasiadas conexiones');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('La conexión a la base de datos fue rechazada');
    } else {
      console.error(`Error al conectar con la base de datos: ${error.message}`);
    }
    return;
  }

  if (connection) {
    console.log('Conexión a la base de datos exitosa');
    connection.release();
  }
});

// Wrapper de compatibilidad: mysql2 devuelve [rows, fields],
// pero el código existente espera solo rows (como mysql + promisify).
const promisePool = pool.promise();
const compatPool = {
  query: async (sql, params) => {
    const [rows] = await promisePool.query(sql, params);
    return rows;
  },
  getConnection: pool.getConnection.bind(pool),
};

module.exports = compatPool;


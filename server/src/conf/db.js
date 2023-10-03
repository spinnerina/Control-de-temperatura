// Importa las dependencias
const mysql = require('mysql');
require('dotenv').config(); // Carga las variables de entorno desde .env

// Obtiene los datos de conexión desde las variables de entorno
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE
} = process.env;

// Crea una conexión a la base de datos
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    throw err;
  }
  console.log('Conexión a la base de datos MySQL establecida');
});

module.exports = connection;
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Tu usuario de PostgreSQL (por defecto es 'postgres')
  host: 'localhost',
  database: 'lirart_db', // El nombre de la base de datos que creaste
  password: '12347', // La contraseña que estableciste durante la instalación
  port: 5432, // El puerto por defecto de PostgreSQL
});

// Consultas
module.exports = {
  query: (text, params) => pool.query(text, params),
};

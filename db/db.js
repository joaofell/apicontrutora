// db.js
require('dotenv').config();
const { Pool } = require('pg');

// Configuração da conexão com o Neon
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: {
    rejectUnauthorized: false, // Aceitar conexões SSL
  },
});

// Exporta o pool para ser usado em outros arquivos
module.exports = pool;

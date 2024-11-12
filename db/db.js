// db.js
require("dotenv").config();
const { Pool } = require("pg");

// Configuração da conexão com o Neon
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: String(process.env.PGPASSWORD), // Força conversão para string
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

module.exports = pool;

const pool = require('../db/db');


const addLog = async (log_level, log_message, log_source, user_id = null, ip_address = null, additional_info = null) => {
  try {
    console.log('Log sendo adicionado:', {
      log_level,
      log_message,
      log_source,
      user_id,
      ip_address,
      additional_info,
    });

    const email = JSON.stringify(additional_info)
    await pool.query(
      'INSERT INTO logs (log_level, log_message, log_source, additional_info) VALUES ($1, $2, $3, $4)',
      [log_level, log_message, log_source, email]
    );
  } catch (err) {
    console.error('Erro ao adicionar log:', err);
  }
};


  const getAllLogs = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM logs ORDER BY log_timestamp DESC');
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao obter logs' });
    }
  };
  
  // Função para obter logs por nível
  const getLogsByLevel = async (req, res) => {
    const { log_level } = req.params;
    try {
      const result = await pool.query('SELECT * FROM logs WHERE log_level = $1 ORDER BY log_timestamp DESC', [log_level]);
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao obter logs' });
    }
  };
  
  module.exports = { addLog, getAllLogs, getLogsByLevel };
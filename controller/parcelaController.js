const pool = require('../db/db'); // Importa o pool de conexões

// Função para listar todas as parcelas
const getParcelas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parcela');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar parcelas:', err);
    res.status(500).json({ error: 'Erro ao buscar parcelas' });
  }
};

// Função para buscar uma parcela por ID
const getParcelaById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM parcela WHERE id = $1', [id]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Parcela não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao buscar parcela:', err);
    res.status(500).json({ error: 'Erro ao buscar parcela' });
  }
};

// Função para criar uma nova parcela
const createParcela = async (req, res) => {
  const { data_prevista, pago, data_paga , valor } = req.body;
  if (data_prevista === undefined || pago === undefined) {
    return res.status(400).json({ error: 'Data prevista e pago são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO parcela (data_prevista, pago, data_paga, valor) VALUES ($1, $2, $3, $4) RETURNING *',
      [data_prevista, pago, data_paga , valor || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar parcela:', err);
    res.status(500).json({ error: 'Erro ao criar parcela' });
  }
};

// Função para atualizar uma parcela
const updateParcela = async (req, res) => {
  const id = parseInt(req.params.id);
  const { data_prevista, pago, data_paga, valor } = req.body;
  
  if (data_prevista === undefined || pago === undefined) {
    return res.status(400).json({ error: 'Data prevista e pago são obrigatórios' });
  }

  try {
    const result = await pool.query(
      'UPDATE parcela SET data_prevista = $1, pago = $2, data_paga = $3, valor = $4 WHERE id = $5 RETURNING *',
      [data_prevista, pago, data_paga, valor || null, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Parcela não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao atualizar parcela:', err);
    res.status(500).json({ error: 'Erro ao atualizar parcela' });
  }
};

// Função para deletar uma parcela
const deleteParcela = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM parcela WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.status(200).json({ message: 'Parcela deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Parcela não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao deletar parcela:', err);
    res.status(500).json({ error: 'Erro ao deletar parcela' });
  }
};

// Exporta todas as funções
module.exports = {
  getParcelas,
  getParcelaById,
  createParcela,
  updateParcela,
  deleteParcela,
};

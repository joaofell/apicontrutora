const pool = require('../db/db');


// Função para listar todos os empreendimentos
const getEmpreendimentos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empreendimento');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar empreendimentos:', err);
    res.status(500).json({ error: 'Erro ao buscar empreendimentos' });
  }
};

// Função para buscar um empreendimento por ID
const getEmpreendimentoById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM empreendimento WHERE id = $1', [id]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Empreendimento não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao buscar empreendimento:', err);
    res.status(500).json({ error: 'Erro ao buscar empreendimento' });
  }
};

// Função para criar um novo empreendimento
const createEmpreendimento = async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO empreendimento (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar empreendimento:', err);
    res.status(500).json({ error: 'Erro ao criar empreendimento' });
  }
};

// Função para atualizar um empreendimento
const updateEmpreendimento = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome } = req.body;
  
  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    const result = await pool.query(
      'UPDATE empreendimento SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Empreendimento não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao atualizar empreendimento:', err);
    res.status(500).json({ error: 'Erro ao atualizar empreendimento' });
  }
};

// Função para deletar um empreendimento
const deleteEmpreendimento = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM empreendimento WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.status(200).json({ message: 'Empreendimento deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Empreendimento não encontrado' });
    }
  } catch (err) {
    console.error('Erro ao deletar empreendimento:', err);
    res.status(500).json({ error: 'Erro ao deletar empreendimento' });
  }
};

// Exporta todas as funções
module.exports = {
  getEmpreendimentos,
  getEmpreendimentoById,
  createEmpreendimento,
  updateEmpreendimento,
  deleteEmpreendimento,
};

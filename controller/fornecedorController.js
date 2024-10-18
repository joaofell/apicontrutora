const pool = require('../db/db');


// Função para listar todos os fornecedores
const getFornecedores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fornecedor');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
};

// Função para buscar um fornecedor por ID
const getFornecedorById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM fornecedor WHERE id = $1', [id]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar fornecedor' });
  }
};

// Função para criar um novo fornecedor
const createFornecedor = async (req, res) => {
  const { nome, razaosocial, cnpj } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO fornecedor (nome, razaosocial, cnpj) VALUES ($1, $2, $3) RETURNING *',
      [nome, razaosocial, cnpj]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
};

// Função para atualizar um fornecedor
const updateFornecedor = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, razaosocial, cnpj } = req.body;
  try {
    const result = await pool.query(
      'UPDATE fornecedor SET nome = $1, razaosocial = $2, cnpj = $3 WHERE id = $4 RETURNING *',
      [nome, razaosocial, cnpj, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
};

// Função para deletar um fornecedor
const deleteFornecedor = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM fornecedor WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.status(200).json({ message: 'Fornecedor deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar fornecedor' });
  }
};

// Exporta todas as funções
module.exports = {
  getFornecedores,
  getFornecedorById,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
};

const pool = require('../db/db');

// Função para listar todas as categorias
const getCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

// Função para buscar uma categoria por ID
const getCategoriaById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Categoria não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao buscar categoria:', err);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
};

// Função para criar uma nova categoria
const createCategoria = async (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
};

// Função para atualizar uma categoria
const updateCategoria = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome } = req.body;
  
  if (!nome) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }

  try {
    const result = await pool.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Categoria não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao atualizar categoria:', err);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};

// Função para deletar uma categoria
const deleteCategoria = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.status(200).json({ message: 'Categoria deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Categoria não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao deletar categoria:', err);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
};

// Exporta todas as funções
module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};

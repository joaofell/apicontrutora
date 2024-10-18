const pool = require('../db/db');

// Função para listar todas as receitas
const getReceitas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM receita');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar receitas:', err);
    res.status(500).json({ error: 'Erro ao buscar receitas' });
  }
};

// Função para buscar uma receita por ID
const getReceitaById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM receita WHERE id = $1', [id]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Receita não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao buscar receita:', err);
    res.status(500).json({ error: 'Erro ao buscar receita' });
  }
};

// Função para criar uma nova receita
const createReceita = async (req, res) => {
  const { data_lanc, preco, descricao, categorias_id, empreendimento_id } = req.body;

  if (!preco || !categorias_id || !empreendimento_id) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO receita (data_lanc, preco, descricao, categorias_id, empreendimento_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data_lanc, preco, descricao, categorias_id, empreendimento_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar receita:', err);
    res.status(500).json({ error: 'Erro ao criar receita' });
  }
};

// Função para atualizar uma receita
const updateReceita = async (req, res) => {
  const id = parseInt(req.params.id);
  const { data_lanc, preco, descricao, categorias_id, empreendimento_id } = req.body;

  if (!preco || !categorias_id || !empreendimento_id) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const result = await pool.query(
      'UPDATE receita SET data_lanc = $1, preco = $2, descricao = $3, categorias_id = $4, empreendimento_id = $5 WHERE id = $6 RETURNING *',
      [data_lanc, preco, descricao, categorias_id, empreendimento_id, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Receita não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao atualizar receita:', err);
    res.status(500).json({ error: 'Erro ao atualizar receita' });
  }
};

// Função para deletar uma receita
const deleteReceita = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM receita WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.status(200).json({ message: 'Receita deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Receita não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao deletar receita:', err);
    res.status(500).json({ error: 'Erro ao deletar receita' });
  }
};

// Exporta todas as funções
module.exports = {
  getReceitas,
  getReceitaById,
  createReceita,
  updateReceita,
  deleteReceita,
};

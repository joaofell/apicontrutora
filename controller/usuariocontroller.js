const pool = require('../db/db');

// Função para listar todos os usuários
const getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Função para buscar um usuário por ID
const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM usuario WHERE id = $1', [id]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
};

// Função para criar um novo usuário
const createUser = async (req, res) => {
  const { nome, email, senha, cargo } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuario (nome, email, senha, cargo) VALUES ($1, $2, $3, $4) RETURNING *',
      [nome, email, senha, cargo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

// Função para atualizar um usuário
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, senha, cargo } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuario SET nome = $1, email = $2, senha = $3, cargo = $4 WHERE id = $5 RETURNING *',
      [nome, email, senha, cargo, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Função para deletar um usuário
const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM usuario WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

// Função para verificar as credenciais de um usuário
const checkCredentials = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    if (result.rows.length) {
      const user = result.rows[0];
      if (senha === user.senha) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false });
      }
    } else {
      res.status(404).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro ao verificar credenciais' });
  }
};

// Exporta todas as funções
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  checkCredentials,
};

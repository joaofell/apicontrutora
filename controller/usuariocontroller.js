const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// Configurações
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Função para listar todos os usuários
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, nome, email, cargo FROM usuario"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
};

// Função para buscar um usuário por ID
const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "SELECT id, nome, email, cargo FROM usuario WHERE id = $1",
      [id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

// Função para criar um novo usuário
const createUser = async (req, res) => {
  const { nome, email, senha, cargo } = req.body;

  try {
    // Verifica se o email já existe
    const emailCheck = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );
    if (emailCheck.rows.length) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Criptografa a senha
    const hashedSenha = await bcrypt.hash(senha, SALT_ROUNDS);

    const result = await pool.query(
      "INSERT INTO usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email",
      [nome, email, hashedSenha]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

// Função para atualizar um usuário
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, senha, cargo } = req.body;

  try {
    let hashedSenha = senha;
    if (senha) {
      hashedSenha = await bcrypt.hash(senha, SALT_ROUNDS);
    }

    const result = await pool.query(
      "UPDATE usuario SET nome = $1, email = $2, senha = $3, cargo = $4 WHERE id = $5 RETURNING id, nome, email, cargo",
      [nome, email, hashedSenha, cargo, id]
    );

    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

// Função para deletar um usuário
const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "DELETE FROM usuario WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length) {
      res.status(200).json({ message: "Usuário deletado com sucesso" });
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
};

// Função para login do usuário
const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Busca o usuário
    const result = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const user = result.rows[0];

    // Verifica a senha
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    try {
      // Cria o payload do token
      const payload = {
        userId: user.id,
        email: user.email,
      };

      // Gera o token
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

      // Define o cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'strict'
      });

      // Retorna sucesso
      return res.status(200).json({
        message: "Login realizado com sucesso",
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email
        }
      });
    } catch (tokenError) {
      console.error('Erro ao gerar token:', tokenError);
      return res.status(500).json({ error: "Erro ao gerar token de autenticação" });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};


// Middleware para verificar autenticação
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Acesso não autorizado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  authenticateToken,
};

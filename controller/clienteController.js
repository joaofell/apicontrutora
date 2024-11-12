const pool = require("../db/db");

// Função para listar todos os clientes
const getClientes = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar clientes:", err);
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
};

// Função para buscar um cliente por ID
const getClienteById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM clientes WHERE id = $1", [
      id,
    ]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Cliente não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao buscar cliente:", err);
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
};

// Função para criar um novo cliente
const createCliente = async (req, res) => {
  const { nome, cpf, email } = req.body;
  if (!nome || !cpf || !email) {
    return res
      .status(400)
      .json({ error: "Nome, CPF e Email são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO clientes (nome, cpf, email) VALUES ($1, $2, $3) RETURNING *",
      [nome, cpf, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar cliente:", err);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
};

// Função para atualizar um cliente
const updateCliente = async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, cpf, email } = req.body;

  if (!nome || !cpf || !email) {
    return res
      .status(400)
      .json({ error: "Nome, CPF e Email são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "UPDATE clientes SET nome = $1, cpf = $2, email = $3 WHERE id = $4 RETURNING *",
      [nome, cpf, email, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Cliente não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao atualizar cliente:", err);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
};

// Função para deletar um cliente
const deleteCliente = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      "DELETE FROM clientes WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length) {
      res.status(200).json({ message: "Cliente deletado com sucesso" });
    } else {
      res.status(404).json({ error: "Cliente não encontrado" });
    }
  } catch (err) {
    console.error("Erro ao deletar cliente:", err);
    res.status(500).json({ error: "Erro ao deletar cliente" });
  }
};

// Exporta todas as funções
module.exports = {
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
};


const pool = require("../db/db");

const getReceitas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        receitas.id,
        receitas.data_lancamento,
        receitas.cliente_id,
        receitas.num_nota,
        receitas.valor,
        receitas.descricao,
        receitas.empreendimento_id,
        empreendimento.nome AS empreendimento_nome,
        categorias.nome AS categoria_nome,
        cliente.nome AS cliente_nome
      FROM 
        receitas
      LEFT JOIN 
        empreendimento ON receitas.empreendimento_id = empreendimento.id
      LEFT JOIN 
        categorias ON receitas.categorias_id = categorias.id
      LEFT JOIN 
        cliente ON receitas.cliente_id = cliente.id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar receitas:", err);
    res.status(500).json({ error: "Erro ao buscar receitas" });
  }
};

const getReceitaById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM receitas WHERE id = $1", [
      id,
    ]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Receita não encontrada" });
    }
  } catch (err) {
    console.error("Erro ao buscar receita:", err);
    res.status(500).json({ error: "Erro ao buscar receita" });
  }
};

const createReceita = async (req, res) => {
  const {
    data_lancamento,
    categorias_id,
    cliente_id,
    num_nota,
    valor,
    descricao,
    empreendimento_id,
  } = req.body;

  if (!categorias_id || !cliente_id || !valor || !empreendimento_id) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não preenchidos" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO receitas (data_lancamento, categorias_id, cliente_id, num_nota, valor, descricao, empreendimento_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        data_lancamento,
        categorias_id,
        cliente_id,
        num_nota,
        valor,
        descricao,
        empreendimento_id,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar receita:", err);
    res.status(500).json({ error: "Erro ao criar receita" });
  }
};

const updateReceita = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    data_lancamento,
    categorias_id,
    cliente_id,
    num_nota,
    valor,
    descricao,
    empreendimento_id,
  } = req.body;

  if (!categorias_id || !cliente_id || !valor || !empreendimento_id) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não preenchidos" });
  }

  try {
    const result = await pool.query(
      "UPDATE receitas SET data_lancamento = $1, categorias_id = $2, cliente_id = $3, num_nota = $4, valor = $5, descricao = $6, empreendimento_id = $7 WHERE id = $8 RETURNING *",
      [
        data_lancamento,
        categorias_id,
        cliente_id,
        num_nota,
        valor,
        descricao,
        empreendimento_id,
        id,
      ]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Receita não encontrada" });
    }
  } catch (err) {
    console.error("Erro ao atualizar receita:", err);
    res.status(500).json({ error: "Erro ao atualizar receita" });
  }
};

const deleteReceita = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const result = await pool.query(
      "DELETE FROM receitas WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length) {
      res.status(200).json({ message: "Receita deletada com sucesso" });
    } else {
      res.status(404).json({ error: "Receita não encontrada" });
    }
  } catch (err) {
    console.error("Erro ao deletar receita:", err);
    res.status(500).json({ error: "Erro ao deletar receita" });
  }
};

module.exports = {
  getReceitas,
  getReceitaById,
  createReceita,
  updateReceita,
  deleteReceita,
};
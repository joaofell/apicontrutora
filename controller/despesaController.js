const pool = require('../db/db');

const getDespesas = async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          despesas.id,
          despesas.data_lancamento,
          despesas.fornecedor_id,
          despesas.num_nota,
          despesas.preco,
          despesas.descricao,
          despesas.empreendimento_id,
          categorias.nome AS categoria_nome
        FROM 
          despesas
        JOIN 
          categorias 
        ON 
          despesas.categorias_id = categorias.id
      `);
      res.status(200).json(result.rows);
    } catch (err) {
      console.error('Erro ao buscar despesas:', err);
      res.status(500).json({ error: 'Erro ao buscar despesas' });
    }
  };
const getDespesaById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM despesas WHERE id = $1', [id]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Despesa não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao buscar despesa:', err);
    res.status(500).json({ error: 'Erro ao buscar despesa' });
  }
};

const createDespesa = async (req, res) => {
  const { data_lancamento, categorias_id, fornecedor_id, num_nota, preco, descricao, empreendimento_id } = req.body;

  if (!categorias_id || !fornecedor_id || !preco || !empreendimento_id) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO despesas (data_lancamento, categorias_id, fornecedor_id, num_nota, preco, descricao, empreendimento_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [data_lancamento, categorias_id, fornecedor_id, num_nota, preco, descricao, empreendimento_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar despesa:', err);
    res.status(500).json({ error: 'Erro ao criar despesa' });
  }
};
const updateDespesa = async (req, res) => {
  const id = parseInt(req.params.id);
  const { data_lancamento, categorias_id, fornecedor_id, num_nota, preco, descricao, empreendimento_id } = req.body;

  if (!categorias_id || !fornecedor_id || !preco || !empreendimento_id) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
  }

  try {
    const result = await pool.query(
      'UPDATE despesas SET data_lancamento = $1, categorias_id = $2, fornecedor_id = $3, num_nota = $4, preco = $5, descricao = $6, empreendimento_id = $7 WHERE id = $8 RETURNING *',
      [data_lancamento, categorias_id, fornecedor_id, num_nota, preco, descricao, empreendimento_id, id]
    );
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Despesa não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao atualizar despesa:', err);
    res.status(500).json({ error: 'Erro ao atualizar despesa' });
  }
};

const deleteDespesa = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM despesas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length) {
      res.status(200).json({ message: 'Despesa deletada com sucesso' });
    } else {
      res.status(404).json({ error: 'Despesa não encontrada' });
    }
  } catch (err) {
    console.error('Erro ao deletar despesa:', err);
    res.status(500).json({ error: 'Erro ao deletar despesa' });
  }
};

module.exports = {
  getDespesas,
  getDespesaById,
  createDespesa,
  updateDespesa,
  deleteDespesa,
};

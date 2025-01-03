const pool = require("../db/db");
const authController = require("../controller/authController");
const { addLog } = require('./logController');

const getDespesas = async (req, res) => {
  const teste = await(authController.getUser.id)
  console.log(teste)
  try {
    const result = await pool.query(`
      SELECT 
        despesas.id,
        despesas.data_lancamento,
        despesas.data_pagamento,
        despesas.fornecedor_id,
        despesas.num_nota,
        despesas.preco,
        despesas.descricao,
        despesas.empreendimento_id,
        despesas.categorias_id,
        empreendimento.nome AS empreendimento_nome,
        categorias.nome AS categoria_nome,
        fornecedor.nome AS fornecedor_nome
      FROM 
        despesas
      LEFT JOIN 
        empreendimento
      ON 
        despesas.empreendimento_id = empreendimento.id
      LEFT JOIN 
        categorias
      ON 
        despesas.categorias_id = categorias.id
      LEFT JOIN 
        fornecedor
      ON 
        despesas.fornecedor_id = fornecedor.id
      `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar despesas:", err);
    res.status(500).json({ error: "Erro ao buscar despesas" });
  }
};
const getDespesaById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM despesas WHERE id = $1", [
      id,
    ]);
    if (result.rows.length) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: "Despesa não encontrada" });
    }
  } catch (err) {
    console.error("Erro ao buscar despesa:", err);
    res.status(500).json({ error: "Erro ao buscar despesa" });
  }
};


const createDespesa = async (req, res) => {
  const {
    data_lancamento,
    data_pagamento,
    categorias_id,
    fornecedor_id,
    num_nota,
    preco,
    descricao,
    empreendimento_id,
  } = req.body;

  if (!categorias_id || !fornecedor_id || !preco || !empreendimento_id) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não preenchidos" });
  }

  try {
    // Inserir despesa no banco
    const result = await pool.query(
      "INSERT INTO despesas (data_lancamento, data_pagamento, categorias_id, fornecedor_id, num_nota, preco, descricao, empreendimento_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        data_lancamento,
        data_pagamento,
        categorias_id,
        fornecedor_id,
        num_nota,
        preco,
        descricao,
        empreendimento_id,
      ]
    );

    const createdDespesa = result.rows[0];

    // Registro de log para criação bem-sucedida
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'INFO',
      `Despesa criada com sucesso. ID: ${createdDespesa.id}`,
      'createDespesa',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(201).json(createdDespesa);
  } catch (err) {
    console.error("Erro ao criar despesa:", err);

    // Registro de log para erro ao criar despesa
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'ERROR',
      `Erro ao criar despesa: ${err.message}`,
      'createDespesa',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(500).json({ error: "Erro ao criar despesa" });
  }
};



const updateDespesa = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    data_lancamento,
    data_pagamento,
    categorias_id,
    fornecedor_id,
    num_nota,
    preco,
    descricao,
    empreendimento_id,
  } = req.body;

  try {
    // Primeiro atualiza a despesa
    const updateResult = await pool.query(
      "UPDATE despesas SET data_lancamento = $1, data_pagamento = $2, categorias_id = $3, fornecedor_id = $4, num_nota = $5, preco = $6, descricao = $7, empreendimento_id = $8 WHERE id = $9 RETURNING *",
      [
        data_lancamento,
        data_pagamento,
        categorias_id,
        fornecedor_id,
        num_nota,
        preco,
        descricao,
        empreendimento_id,
        id,
      ]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "Despesa não encontrada" });
    }

    // Depois busca a despesa atualizada com todos os dados relacionados
    const result = await pool.query(`
      SELECT 
        despesas.*,
        empreendimento.nome AS empreendimento_nome,
        categorias.nome AS categoria_nome,
        fornecedor.nome AS fornecedor_nome
      FROM 
        despesas
      LEFT JOIN 
        empreendimento ON despesas.empreendimento_id = empreendimento.id
      LEFT JOIN 
        categorias ON despesas.categorias_id = categorias.id
      LEFT JOIN 
        fornecedor ON despesas.fornecedor_id = fornecedor.id
      WHERE despesas.id = $1
    `, [id]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao atualizar despesa:", err);

    // Registro de log para erro ao atualizar despesa
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'ERROR',
      `Erro ao atualizar despesa: ${err.message}`,
      'updateDespesa',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(500).json({ error: "Erro ao atualizar despesa" });
  }
};

const deleteDespesa = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    // Tentar deletar a despesa no banco
    const result = await pool.query(
      "DELETE FROM despesas WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length) {
      // Registro de log para exclusão bem-sucedida
      const email = req.user?.email || 'email-desconhecido';
      await addLog(
        'INFO',
        `Despesa deletada com sucesso. ID: ${id}`,
        'deleteDespesa',
        null,
        null,
        email // Apenas o email no campo additional_info
      );

      res.status(200).json({ message: "Despesa deletada com sucesso" });
    } else {
      // Registro de log para despesa não encontrada
      const email = req.user?.email || 'email-desconhecido';
      await addLog(
        'WARN',
        `Tentativa de deletar despesa não encontrada. ID: ${id}`,
        'deleteDespesa',
        null,
        null,
        email // Apenas o email no campo additional_info
      );

      res.status(404).json({ error: "Despesa não encontrada" });
    }
  } catch (err) {
    console.error("Erro ao deletar despesa:", err);

    // Registro de log para erro ao deletar despesa
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'ERROR',
      `Erro ao deletar despesa: ${err.message}`,
      'deleteDespesa',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(500).json({ error: "Erro ao deletar despesa" });
  }
};

const getDespesasResumo = async (req, res) => {
  try {
    const totalQuery = await pool.query(`
      SELECT 
        SUM(preco) as total,
        AVG(preco) as media_mensal,
        COUNT(*) as quantidade
      FROM despesas
      WHERE data_lancamento >= NOW() - INTERVAL '12 MONTHS'
    `);

    const historicoQuery = await pool.query(`
      SELECT 
        TO_CHAR(data_lancamento, 'MM/YYYY') as mes,
        SUM(preco) as total
      FROM despesas
      WHERE data_lancamento >= NOW() - INTERVAL '12 MONTHS'
      GROUP BY mes
      ORDER BY MIN(data_lancamento)
    `);

    res.status(200).json({
      total: totalQuery.rows[0].total || 0,
      mediaMensal: totalQuery.rows[0].media_mensal || 0,
      quantidade: totalQuery.rows[0].quantidade || 0,
      historicoMensal: historicoQuery.rows
    });
  } catch (err) {
    console.error("Erro ao buscar resumo de despesas:", err);
    res.status(500).json({ error: "Erro ao buscar resumo de despesas" });
  }
};

module.exports = {
  getDespesas,
  getDespesaById,
  createDespesa,
  updateDespesa,
  deleteDespesa,
  getDespesasResumo
};

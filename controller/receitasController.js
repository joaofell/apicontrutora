const pool = require("../db/db");
const { addLog } = require('./logController');


// Função para listar todas as receitas
const getReceitas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        receita.id,
        receita.data_lanc,
        receita.data_pag,
        receita.preco,
        receita.descricao,
        categorias.nome AS categoria_nome,
        empreendimento.nome AS empreendimento_nome,
        clientes.nome AS cliente_nome
      FROM receita
      LEFT JOIN categorias ON receita.categorias_id = categorias.id
      LEFT JOIN empreendimento ON receita.empreendimento_id = empreendimento.id
      LEFT JOIN clientes ON receita.clientes_id = clientes.id
    `);
    // const result =  await pool.query(`
    //   SELECT * FROM receita;
    //   `)
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar receitas:", err);
    res.status(500).json({ error: "Erro ao buscar receitas" });
  }
};

// Função para buscar uma receita por ID
const getReceitaById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      `
      SELECT 
        receita.id,
        receita.data_lanc,
        receita.data_pag,
        receita.preco,
        receita.descricao,
        categorias.nome AS categoria_nome,
        empreendimento.nome AS empreendimento_nome,
        clientes.nome AS cliente_nome
      FROM receita
      JOIN categorias ON receita.categorias_id = categorias.id
      JOIN empreendimento ON receita.empreendimento_id = empreendimento.id
      JOIN clientes ON receita.clientes_id = clientes.id
      WHERE receita.id = $1
    `,
      [id]
    );
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
    data_lanc,
    data_pag,
    preco,
    descricao,
    categorias_id,
    empreendimento_id,
    clientes_id,
  } = req.body;

  if (!preco || !categorias_id || !empreendimento_id || !clientes_id) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não preenchidos" });
  }

  try {
    // Inserir receita no banco de dados
    const result = await pool.query(
      "INSERT INTO receita (data_lanc, data_pag, preco, descricao, categorias_id, empreendimento_id, clientes_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        data_lanc,
        data_pag,
        preco,
        descricao,
        categorias_id,
        empreendimento_id,
        clientes_id,
      ]
    );

    const createdReceita = result.rows[0];

    // Registro de log para criação bem-sucedida
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'INFO',
      `Receita criada com sucesso. ID: ${createdReceita.id}`,
      'createReceita',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(201).json(createdReceita);
  } catch (err) {
    console.error("Erro ao criar receita:", err);

    // Registro de log para erro ao criar receita
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'ERROR',
      `Erro ao criar receita: ${err.message}`,
      'createReceita',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(500).json({ error: "Erro ao criar receita" });
  }
};



const updateReceita = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    data_lanc,
    data_pag,
    preco,
    descricao,
    categorias_id,
    empreendimento_id,
    clientes_id,
  } = req.body;

  if (!preco || !categorias_id || !empreendimento_id || !clientes_id) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios não preenchidos" });
  }

  try {
    // Atualizar a receita no banco de dados
    const result = await pool.query(
      "UPDATE receita SET data_lanc = $1, data_pag = $2, preco = $3, descricao = $4, categorias_id = $5, empreendimento_id = $6, clientes_id = $7 WHERE id = $8 RETURNING *",
      [
        data_lanc,
        data_pag,
        preco,
        descricao,
        categorias_id,
        empreendimento_id,
        clientes_id,
        id,
      ]
    );

    if (result.rows.length) {
      // Registro de log para atualização bem-sucedida
      const email = req.user?.email || 'email-desconhecido';
      await addLog(
        'INFO',
        `Receita atualizada com sucesso. ID: ${id}`,
        'updateReceita',
        null,
        null,
        email // Apenas o email no campo additional_info
      );

      res.status(200).json(result.rows[0]);
    } else {
      // Registro de log para receita não encontrada
      const email = req.user?.email || 'email-desconhecido';
      await addLog(
        'WARN',
        `Tentativa de atualizar receita não encontrada. ID: ${id}`,
        'updateReceita',
        null,
        null,
        email // Apenas o email no campo additional_info
      );

      res.status(404).json({ error: "Receita não encontrada" });
    }
  } catch (err) {
    console.error("Erro ao atualizar receita:", err);

    // Registro de log para erro ao atualizar receita
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'ERROR',
      `Erro ao atualizar receita: ${err.message}`,
      'updateReceita',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(500).json({ error: "Erro ao atualizar receita" });
  }
};


// Função para deletar uma receita
const deleteReceita = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Deletar a receita no banco de dados
    const result = await pool.query(
      "DELETE FROM receita WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length) {
      // Registro de log para exclusão bem-sucedida
      const email = req.user?.email || 'email-desconhecido';
      await addLog(
        'INFO',
        `Receita deletada com sucesso. ID: ${id}`,
        'deleteReceita',
        null,
        null,
        email // Apenas o email no campo additional_info
      );

      res.status(200).json({ message: "Receita deletada com sucesso" });
    } else {
      // Registro de log para receita não encontrada
      const email = req.user?.email || 'email-desconhecido';
      await addLog(
        'WARN',
        `Tentativa de deletar receita não encontrada. ID: ${id}`,
        'deleteReceita',
        null,
        null,
        email // Apenas o email no campo additional_info
      );

      res.status(404).json({ error: "Receita não encontrada" });
    }
  } catch (err) {
    console.error("Erro ao deletar receita:", err);

    // Registro de log para erro ao deletar receita
    const email = req.user?.email || 'email-desconhecido';
    await addLog(
      'ERROR',
      `Erro ao deletar receita: ${err.message}`,
      'deleteReceita',
      null,
      null,
      email // Apenas o email no campo additional_info
    );

    res.status(500).json({ error: "Erro ao deletar receita" });
  }
};

const getReceitasResumo = async (req, res) => {
  try {
    const totalQuery = await pool.query(`
      SELECT 
        SUM(preco) as total,
        AVG(preco) as media_mensal,
        COUNT(*) as quantidade
      FROM receita
      WHERE data_lanc >= NOW() - INTERVAL '12 MONTHS'
    `);

    const historicoQuery = await pool.query(`
      SELECT 
        TO_CHAR(data_lanc, 'MM/YYYY') as mes,
        SUM(preco) as total
      FROM receita
      WHERE data_lanc >= NOW() - INTERVAL '12 MONTHS'
      GROUP BY mes
      ORDER BY MIN(data_lanc)
    `);

    res.status(200).json({
      total: totalQuery.rows[0].total || 0,
      mediaMensal: totalQuery.rows[0].media_mensal || 0,
      quantidade: totalQuery.rows[0].quantidade || 0,
      historicoMensal: historicoQuery.rows
    });
  } catch (err) {
    console.error("Erro ao buscar resumo de receitas:", err);
    res.status(500).json({ error: "Erro ao buscar resumo de receitas" });
  }
};

// Exporta todas as funções
module.exports = {
  getReceitas,
  getReceitaById,
  createReceita,
  updateReceita,
  deleteReceita,
  getReceitasResumo
};

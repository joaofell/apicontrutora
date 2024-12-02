const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/auth");

// Protege todas as rotas da API
// router.use(isAuthenticated);

// Importar diretamente os routers
router.use("/fornecedores", require("./fornecedor"));
router.use("/usuarios", require("./usuario"));
router.use("/categorias", require("./categoria"));
router.use("/empreendimentos", require("./empreendimento"));
router.use("/parcelas", require("./parcela"));
router.use("/despesas", require("./despesa")); // Importa o router de despesas
router.use("/receitas", require("./receita"));   // Importa o router de receitas
router.use("/clientes", require("./cliente"));
router.use("/logs", require("./logs"));

module.exports = router;

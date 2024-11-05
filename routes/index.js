const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/auth");

// Protege todas as rotas da API
router.use(isAuthenticated);

router.use("/fornecedores", require("./fornecedor"));
router.use("/usuarios", require("./usuario"));
router.use("/categorias", require("./categoria"));
router.use("/empreendimentos", require("./empreendimento"));
router.use("/parcelas", require("./parcela"));
router.use("/despesas", require("./despesa"));
router.use("/receitas", require("./receita"));

module.exports = router;

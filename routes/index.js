const router = require('express').Router();
const cors = require('cors');
const fornecedorRoutes = require('./fornecedor');
const maquinaRoutes = require('./usuario'); 
const categoriaRoutes = require('./categoria'); 
const empreendimentoRoutes = require('./empreendimento'); 
const parcelaRoutes = require('./parcela');
const despesaRoutes = require('./despesa');
const receitaRoutes = require('./receita'); 

router.use(cors());

router.use('/', fornecedorRoutes);
router.use('/', maquinaRoutes);
router.use('/', categoriaRoutes);
router.use('/', empreendimentoRoutes);
router.use('/', parcelaRoutes);
router.use('/', despesaRoutes);
router.use('/', receitaRoutes);

module.exports = router;

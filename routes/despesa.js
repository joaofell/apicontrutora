const express = require('express');
const router = express.Router();
const despesaController = require('../controller/despesaController');

// Definir rotas específicas antes das genéricas
router.get('/resumo', despesaController.getDespesasResumo);
router.get('/', despesaController.getDespesas);
router.get('/:id', despesaController.getDespesaById);
router.post('/', despesaController.createDespesa);
router.put('/:id', despesaController.updateDespesa);
router.delete('/:id', despesaController.deleteDespesa);

// Exportar apenas o router
module.exports = router;

const express = require('express');
const router = express.Router();
const despesaController = require('../controller/despesaController');

router.get('/', despesaController.getDespesas);
router.get('/:id', despesaController.getDespesaById);
router.post('/', despesaController.createDespesa);
router.put('/:id', despesaController.updateDespesa);
router.delete('/:id', despesaController.deleteDespesa);

module.exports = router;

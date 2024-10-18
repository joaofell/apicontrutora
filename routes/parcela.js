const express = require('express');
const router = express.Router();
const parcelaController = require('../controller/parcelaController'); // Atualize o caminho conforme necessário

// Definir rotas para as funções de parcela
router.get('/parcelas', parcelaController.getParcelas);
router.get('/parcelas/:id', parcelaController.getParcelaById);
router.post('/parcelas', parcelaController.createParcela);
router.put('/parcelas/:id', parcelaController.updateParcela);
router.delete('/parcelas/:id', parcelaController.deleteParcela);

module.exports = router;

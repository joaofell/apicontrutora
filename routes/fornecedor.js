const express = require('express');
const router = express.Router();
const fornecedorController = require('../controller/fornecedorController');

// Definir rotas para as funções de fornecedor
router.get('/', fornecedorController.getFornecedores);
router.get('/:id', fornecedorController.getFornecedorById);
router.post('/', fornecedorController.createFornecedor);
router.put('/:id', fornecedorController.updateFornecedor);
router.delete('/:id', fornecedorController.deleteFornecedor);

module.exports = router;

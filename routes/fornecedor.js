const express = require('express');
const router = express.Router();
const fornecedorController = require('../controller/fornecedorController');

// Definir rotas para as funções de fornecedor
router.get('/fornecedores', fornecedorController.getFornecedores);
router.get('/fornecedores/:id', fornecedorController.getFornecedorById);
router.post('/fornecedores', fornecedorController.createFornecedor);
router.put('/fornecedores/:id', fornecedorController.updateFornecedor);
router.delete('/fornecedores/:id', fornecedorController.deleteFornecedor);

module.exports = router;

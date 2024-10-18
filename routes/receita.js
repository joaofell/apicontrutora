const express = require('express');
const router = express.Router();
const receitaController = require('../controller/receitasController');

// Definir rotas para as funções de receita
router.get('/receitas', receitaController.getReceitas);
router.get('/receitas/:id', receitaController.getReceitaById);
router.post('/receitas', receitaController.createReceita);
router.put('/receitas/:id', receitaController.updateReceita);
router.delete('/receitas/:id', receitaController.deleteReceita);

module.exports = router;
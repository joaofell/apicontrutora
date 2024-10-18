const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/categoriaController'); // Atualize o caminho conforme necessário

// Definir rotas para as funções de categoria
router.get('/categorias', categoriaController.getCategorias);
router.get('/categorias/:id', categoriaController.getCategoriaById);
router.post('/categorias', categoriaController.createCategoria);
router.put('/categorias/:id', categoriaController.updateCategoria);
router.delete('/categorias/:id', categoriaController.deleteCategoria);

module.exports = router;

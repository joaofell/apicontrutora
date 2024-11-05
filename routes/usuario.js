// index.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controller/usuariocontroller');

// Definir as rotas para as operações com usuário
router.get('/usuarios', usuarioController.getUsers);
router.get('/usuarios/:id', usuarioController.getUserById);
router.post('/usuarios', usuarioController.createUser);
router.put('/usuarios/:id', usuarioController.updateUser);
router.delete('/usuarios/:id', usuarioController.deleteUser);
router.post('/login', usuarioController.login);

module.exports = router;

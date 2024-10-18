const express = require('express');
const router = express.Router();
const empreendimentoController = require('../controller/empreendimentoController'); // Atualize o caminho conforme necessário

// Definir rotas para as funções de empreendimento
router.get('/empreendimentos', empreendimentoController.getEmpreendimentos);
router.get('/empreendimentos/:id', empreendimentoController.getEmpreendimentoById);
router.post('/empreendimentos', empreendimentoController.createEmpreendimento);
router.put('/empreendimentos/:id', empreendimentoController.updateEmpreendimento);
router.delete('/empreendimentos/:id', empreendimentoController.deleteEmpreendimento);

module.exports = router;

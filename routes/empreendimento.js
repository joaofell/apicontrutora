const express = require('express');
const router = express.Router();
const empreendimentoController = require('../controller/empreendimentoController'); // Atualize o caminho conforme necessário

// Definir rotas para as funções de empreendimento
router.get('/', empreendimentoController.getEmpreendimentos);
router.get('/:id', empreendimentoController.getEmpreendimentoById);
router.post('/', empreendimentoController.createEmpreendimento);
router.put('/:id', empreendimentoController.updateEmpreendimento);
router.delete('/:id', empreendimentoController.deleteEmpreendimento);

module.exports = router;

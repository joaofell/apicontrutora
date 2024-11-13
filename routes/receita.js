const express = require("express");
const router = express.Router();
const receitaController = require("../controller/receitasController");

// Definir rotas para as funções de receita
router.get("/", receitaController.getReceitas);
router.get("/:id", receitaController.getReceitaById);
router.post("/", receitaController.createReceita);
router.put("/:id", receitaController.updateReceita);
router.delete("/:id", receitaController.deleteReceita);

module.exports = router;

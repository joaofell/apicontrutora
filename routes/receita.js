const express = require("express");
const router = express.Router();
const receitaController = require("../controller/receitasController");

// Definir rotas específicas antes das genéricas
router.get("/resumo", receitaController.getReceitasResumo);
router.get("/", receitaController.getReceitas);
router.get("/:id", receitaController.getReceitaById);
router.post("/", receitaController.createReceita);
router.put("/:id", receitaController.updateReceita);
router.delete("/:id", receitaController.deleteReceita);

// Exportar apenas o router
module.exports = router;

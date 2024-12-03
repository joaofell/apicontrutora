const express = require("express");
const router = express.Router();
const logController = require("../controller/logController"); // Atualize o caminho conforme necessário

// Definir rotas para as funções de categoria
router.get("/", logController.getAllLogs);
router.get("/level/:log_level", logController.getLogsByLevel);

module.exports = router;

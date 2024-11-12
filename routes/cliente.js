const express = require("express");
const router = express.Router();
const clienteController = require("../controller/clienteController");

// Definir rotas para as funções de categoria
router.get("/", clienteController.getClientes);
router.get("/:id", clienteController.getClienteById);
router.post("/", clienteController.createCliente);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

module.exports = router;
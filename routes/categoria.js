const express = require("express");
const router = express.Router();
const categoriaController = require("../controller/categoriaController"); // Atualize o caminho conforme necessário

// Definir rotas para as funções de categoria
router.get("/", categoriaController.getCategorias);
router.get("/:id", categoriaController.getCategoriaById);
router.post("/", categoriaController.createCategoria);
router.put("/:id", categoriaController.updateCategoria);
router.delete("/:id", categoriaController.deleteCategoria);

module.exports = router;

const express = require("express");
const passport = require("passport"); // Adicionar importação
const app = express();
const configureApp = require("./config/app");
const configurePassport = require("./config/passport");
const routes = require("./routes/index");
const authRoutes = require("./routes/auth");

// Configuração da aplicação (cors, session, etc)
configureApp(app);

// Configuração do passport
configurePassport(passport);

// Rotas de autenticação
app.use("/auth", authRoutes);

// Rotas da API
app.use("/api", routes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

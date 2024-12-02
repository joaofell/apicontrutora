const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const logger = require("../middlewares/logger"); // Importar o logger

module.exports = (app) => {
  // Middleware básico
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:8000",
      credentials: true,
    })
  );

  // Configuração da sessão
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "sua-chave-secreta",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
      },
    })
  );

  // Inicialização do passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Middleware de logger
  app.use(logger);
};

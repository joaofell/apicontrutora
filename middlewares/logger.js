const logger = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(`Ação: ${req.method} ${req.originalUrl} | Usuário: ${req.user.email}`);
  } else {
    console.log(`Ação: ${req.method} ${req.originalUrl} | Usuário: Não autenticado`);
  }
  next();
};

module.exports = logger;
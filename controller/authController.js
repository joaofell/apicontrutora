const bcrypt = require("bcryptjs");
const pool = require("../db/db");

exports.signup = async (req, res) => {
  const client = await pool.connect();

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Verifica se o usuário já existe
    const existingUser = await client.query(
      "SELECT id FROM usuario WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("INSERT INTO usuario (email, senha) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    res.json({ message: "Usuário criado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
};

exports.login = (req, res) => {
  // Passport já fez a autenticação
  const { id, email, nome, cargo } = req.user;
  res.json({ user: { id, email, nome, cargo } });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Logout realizado com sucesso" });
  });
};

exports.getUser = (req, res) => {
  if (req.isAuthenticated()) {
    const { id, email, nome, cargo } = req.user;
    res.json({ user: { id, email, nome, cargo } });
  } else {
    console.log("aewew")
    res.status(401).json({ message: "Não autenticado" });
  }
};

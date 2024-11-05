const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../db/db");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const client = await pool.connect();
          const result = await client.query(
            "SELECT id, email, nome, senha, cargo FROM usuario WHERE email = $1",
            [email]
          );
          client.release();

          if (result.rows.length === 0) {
            return done(null, false, { message: "Email não encontrado" });
          }

          const user = result.rows[0];
          const isMatch = await bcrypt.compare(password, user.senha);

          if (!isMatch) {
            return done(null, false, { message: "Senha incorreta" });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT id, email, nome, cargo FROM usuario WHERE id = $1",
        [id]
      );
      client.release();

      if (result.rows.length === 0) {
        return done(null, false);
      }

      done(null, result.rows[0]);
    } catch (error) {
      done(error);
    }
  });
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { getPool, sql } = require('../config/database');

const authService = {
  async gerarHash(senha) {
    return bcrypt.hash(senha, 10);
  },

  async autenticar(email, senha) {
    const pool = await getPool();

    const result = await pool
      .request()
      .input('email', sql.VarChar(255), email)
      .query(`
        SELECT idProfessor, nome, email, senha
        FROM Professores
        WHERE email = @email
      `);

    const professor = result.recordset[0];

    if (!professor || !professor.senha) {
      return null;
    }

    if (!await bcrypt.compare(senha, professor.senha)) {
      return null;
    }

    const dados = {
      idProfessor: professor.idProfessor,
      nome: professor.nome,
      email: professor.email,
    };

    const token = jwt.sign(dados, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });

    return { token, professor: dados };
  },
};

module.exports = authService;

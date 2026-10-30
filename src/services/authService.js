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

  // O e-mail não pode se repetir entre professores e alunos.
  // Devolve { perfil, id } de quem já usa o e-mail, ou null se estiver livre.
  async buscarPorEmail(email) {
    const pool = await getPool();

    const result = await pool
      .request()
      .input('email', sql.VarChar(255), email)
      .query(`
        SELECT 'professor' AS perfil, idProfessor AS id FROM Professores WHERE email = @email
        UNION ALL
        SELECT 'aluno' AS perfil, idAluno AS id FROM Alunos WHERE email = @email
      `);

    return result.recordset[0] || null;
  },
};

module.exports = authService;

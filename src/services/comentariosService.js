const { getPool, sql } = require('../config/database');

// Cada linha guarda o comentário do aluno e, se houver, a resposta do professor
const SELECT_COMENTARIOS = `
  SELECT
    idComentario,
    idAula,
    nomeAluno,
    texto,
    dataComentario,
    resposta,
    nomeProfessorResposta,
    dataResposta
  FROM Comentarios
`;

const comentariosService = {
  async findByAula(idAula) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAula', sql.Int, idAula)
        .query(`
          ${SELECT_COMENTARIOS}
          WHERE idAula = @idAula
          ORDER BY dataComentario ASC
        `);

      return result.recordset;
    } catch (error) {
      console.error('Erro ao buscar comentários:', error.message);
      throw error;
    }
  },

  async findById(idComentario) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idComentario', sql.Int, idComentario)
        .query(`
          ${SELECT_COMENTARIOS}
          WHERE idComentario = @idComentario
        `);

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Erro ao buscar comentário:', error.message);
      throw error;
    }
  },

  async create(comentario) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAula', sql.Int, comentario.idAula)
        .input('nomeAluno', sql.VarChar(100), comentario.nomeAluno)
        .input('texto', sql.VarChar(1000), comentario.texto)
        .query(`
          INSERT INTO Comentarios (idAula, nomeAluno, texto, dataComentario)
          VALUES (@idAula, @nomeAluno, @texto, GETDATE());

          SELECT SCOPE_IDENTITY() AS idComentario;
        `);

      const idComentario = result.recordset[0].idComentario;

      return this.findById(idComentario);
    } catch (error) {
      console.error('Erro ao criar comentário:', error.message);
      throw error;
    }
  },

  async responder(idComentario, resposta) {
    try {
      const pool = await getPool();

      await pool
        .request()
        .input('idComentario', sql.Int, idComentario)
        .input('resposta', sql.VarChar(1000), resposta.texto)
        .input('nomeProfessor', sql.VarChar(255), resposta.nomeProfessor)
        .query(`
          UPDATE Comentarios
          SET
            resposta = @resposta,
            nomeProfessorResposta = @nomeProfessor,
            dataResposta = GETDATE()
          WHERE idComentario = @idComentario
        `);

      return this.findById(idComentario);
    } catch (error) {
      console.error('Erro ao responder comentário:', error.message);
      throw error;
    }
  },

  // Chamado quando uma aula é excluída, para não deixar comentários soltos
  async deleteByAula(idAula) {
    try {
      const pool = await getPool();

      await pool
        .request()
        .input('idAula', sql.Int, idAula)
        .query('DELETE FROM Comentarios WHERE idAula = @idAula');
    } catch (error) {
      console.error('Erro ao deletar comentários da aula:', error.message);
      throw error;
    }
  },
};

module.exports = comentariosService;

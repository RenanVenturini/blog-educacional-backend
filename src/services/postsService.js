const { getPool, sql } = require('../config/database');

const SELECT_AULAS = `
  SELECT
    A.idAula,
    A.titulo,
    A.conteudo,
    A.idProfessor,
    A.idMateria,
    P.nome AS nomeProfessor,
    M.nome AS nomeMateria,
    A.dataPublicacao
  FROM Aulas A
  INNER JOIN Professores P
    ON P.idProfessor = A.idProfessor
  INNER JOIN Materias M
    ON M.idMateria = A.idMateria
`;

const postsService = {
  async create(aula) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('titulo', sql.VarChar(255), aula.titulo)
        .input('conteudo', sql.VarChar(sql.MAX), aula.conteudo)
        .input('idProfessor', sql.Int, aula.idProfessor)
        .input('idMateria', sql.Int, aula.idMateria)
        .query(`
          INSERT INTO Aulas (
            titulo,
            conteudo,
            idProfessor,
            idMateria,
            dataPublicacao
          )
          VALUES (
            @titulo,
            @conteudo,
            @idProfessor,
            @idMateria,
            GETDATE()
          );

          SELECT SCOPE_IDENTITY() AS idAula;
        `);

      const idAula = result.recordset[0].idAula;

      return this.findById(idAula);
    } catch (error) {
      console.error('Erro ao criar aula:', error.message);
      throw error;
    }
  },

  async findAll() {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .query(`
          ${SELECT_AULAS}
          ORDER BY A.dataPublicacao DESC
        `);

      return result.recordset;
    } catch (error) {
      console.error('Erro ao buscar aulas:', error.message);
      throw error;
    }
  },

  async findById(id) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAula', sql.Int, id)
        .query(`
          ${SELECT_AULAS}
          WHERE A.idAula = @idAula
        `);

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Erro ao buscar aula por ID:', error.message);
      throw error;
    }
  },

  async update(id, dadosAtualizados) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAula', sql.Int, id)
        .input('titulo', sql.VarChar(255), dadosAtualizados.titulo)
        .input('conteudo', sql.VarChar(sql.MAX), dadosAtualizados.conteudo)
        .input('idMateria', sql.Int, dadosAtualizados.idMateria)
        .query(`
          UPDATE Aulas
          SET
            titulo = @titulo,
            conteudo = @conteudo,
            idMateria = @idMateria
          WHERE idAula = @idAula
        `);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      console.error('Erro ao atualizar aula:', error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAula', sql.Int, id)
        .query(`
          DELETE FROM Aulas
          WHERE idAula = @idAula
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Erro ao deletar aula:', error.message);
      throw error;
    }
  },

  async search(termo) {
    try {
      const pool = await getPool();
      const termoPesquisa = termo?.trim() ?? '';

      if (!termoPesquisa) {
        return this.findAll();
      }

      const result = await pool
        .request()
        .input('termo', sql.VarChar(255), `%${termoPesquisa}%`)
        .query(`
          ${SELECT_AULAS}
          WHERE A.titulo LIKE @termo
             OR A.conteudo LIKE @termo
             OR P.nome LIKE @termo
             OR M.nome LIKE @termo
          ORDER BY A.dataPublicacao DESC
        `);

      return result.recordset;
    } catch (error) {
      console.error('Erro ao buscar aulas:', error.message);
      throw error;
    }
  },
};

module.exports = postsService;
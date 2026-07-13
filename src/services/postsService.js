const { getPool, sql } = require('../config/database');

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
          INSERT INTO Aulas (titulo, conteudo, idProfessor, idMateria, dataPublicacao)
          VALUES (@titulo, @conteudo, @idProfessor, @idMateria, GETDATE())
          SELECT SCOPE_IDENTITY() as idAula
        `);

      const idAula = result.recordset[0].idAula;

      return {
        idAula,
        titulo: aula.titulo,
        conteudo: aula.conteudo,
        idProfessor: aula.idProfessor,
        idMateria: aula.idMateria,
        dataPublicacao: new Date(),
      };
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
        .query('SELECT * FROM Aulas ORDER BY dataPublicacao DESC');

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
        .query('SELECT * FROM Aulas WHERE idAula = @idAula');

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
        .input('idProfessor', sql.Int, dadosAtualizados.idProfessor)
        .input('idMateria', sql.Int, dadosAtualizados.idMateria)
        .query(`
          UPDATE Aulas 
          SET titulo = @titulo, 
              conteudo = @conteudo, 
              idProfessor = @idProfessor, 
              idMateria = @idMateria
          WHERE idAula = @idAula
          SELECT * FROM Aulas WHERE idAula = @idAula
        `);

      return result.recordset[0] || null;
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
        .query('DELETE FROM Aulas WHERE idAula = @idAula');

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Erro ao deletar aula:', error.message);
      throw error;
    }
  },

  async search(termo) {
    try {
      const pool = await getPool();
      
      const result = await pool
        .request()
        .input('termo', sql.VarChar(255), `%${termo}%`)
        .query(`
          SELECT * FROM Aulas 
          WHERE titulo LIKE @termo 
             OR conteudo LIKE @termo
          ORDER BY dataPublicacao DESC
        `);

      return result.recordset;
    } catch (error) {
      console.error('Erro ao buscar aulas:', error.message);
      throw error;
    }
  },
};

module.exports = postsService;

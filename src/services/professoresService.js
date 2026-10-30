const { getPool, sql } = require('../config/database');
const authService = require('./authService');

const professoresService = {
  async findAll(pagina, limite) {
    try {
      const pool = await getPool();

      // Pula os registros das páginas anteriores e pega só os da página pedida
      const offset = (pagina - 1) * limite;

      const result = await pool
        .request()
        .input('offset', sql.Int, offset)
        .input('limite', sql.Int, limite)
        .query(`
          SELECT idProfessor, nome, email
          FROM Professores
          ORDER BY nome
          OFFSET @offset ROWS
          FETCH NEXT @limite ROWS ONLY
        `);

      const totalResult = await pool
        .request()
        .query('SELECT COUNT(*) AS total FROM Professores');

      const total = totalResult.recordset[0].total;

      return {
        dados: result.recordset,
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      };
    } catch (error) {
      console.error('Erro ao listar professores:', error.message);
      throw error;
    }
  },

  async findById(id) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idProfessor', sql.Int, id)
        .query(`
          SELECT idProfessor, nome, email
          FROM Professores
          WHERE idProfessor = @idProfessor
        `);

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Erro ao buscar professor por ID:', error.message);
      throw error;
    }
  },

  async create(professor) {
    try {
      const pool = await getPool();
      const senhaHash = await authService.gerarHash(professor.senha);

      const result = await pool
        .request()
        .input('nome', sql.VarChar(255), professor.nome)
        .input('email', sql.VarChar(255), professor.email)
        .input('senha', sql.VarChar(255), senhaHash)
        .query(`
          INSERT INTO Professores (nome, email, senha)
          VALUES (@nome, @email, @senha);

          SELECT SCOPE_IDENTITY() AS idProfessor;
        `);

      const idProfessor = result.recordset[0].idProfessor;

      return this.findById(idProfessor);
    } catch (error) {
      console.error('Erro ao criar professor:', error.message);
      throw error;
    }
  },

  async update(id, dadosAtualizados) {
    try {
      const pool = await getPool();

      // A senha é opcional na edição: se não vier, a senha atual é mantida
      let senhaHash = null;

      if (dadosAtualizados.senha) {
        senhaHash = await authService.gerarHash(dadosAtualizados.senha);
      }

      const result = await pool
        .request()
        .input('idProfessor', sql.Int, id)
        .input('nome', sql.VarChar(255), dadosAtualizados.nome)
        .input('email', sql.VarChar(255), dadosAtualizados.email)
        .input('senha', sql.VarChar(255), senhaHash)
        .query(`
          UPDATE Professores
          SET
            nome = @nome,
            email = @email,
            senha = COALESCE(@senha, senha)
          WHERE idProfessor = @idProfessor
        `);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      console.error('Erro ao atualizar professor:', error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idProfessor', sql.Int, id)
        .query(`
          DELETE FROM Professores
          WHERE idProfessor = @idProfessor
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Erro ao deletar professor:', error.message);
      throw error;
    }
  },

  // Usado antes de excluir: um professor com aulas não pode ser removido
  async contarAulas(id) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idProfessor', sql.Int, id)
        .query('SELECT COUNT(*) AS total FROM Aulas WHERE idProfessor = @idProfessor');

      return result.recordset[0].total;
    } catch (error) {
      console.error('Erro ao contar aulas do professor:', error.message);
      throw error;
    }
  },
};

module.exports = professoresService;

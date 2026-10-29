const { getPool, sql } = require('../config/database');

const alunosService = {
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
          SELECT idAluno, nome, email
          FROM Alunos
          ORDER BY nome
          OFFSET @offset ROWS
          FETCH NEXT @limite ROWS ONLY
        `);

      const totalResult = await pool
        .request()
        .query('SELECT COUNT(*) AS total FROM Alunos');

      const total = totalResult.recordset[0].total;

      return {
        dados: result.recordset,
        pagina,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      };
    } catch (error) {
      console.error('Erro ao listar alunos:', error.message);
      throw error;
    }
  },

  async findById(id) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAluno', sql.Int, id)
        .query(`
          SELECT idAluno, nome, email
          FROM Alunos
          WHERE idAluno = @idAluno
        `);

      return result.recordset[0] || null;
    } catch (error) {
      console.error('Erro ao buscar aluno por ID:', error.message);
      throw error;
    }
  },

  // Alunos não fazem login, então o cadastro tem só nome e e-mail
  async create(aluno) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('nome', sql.VarChar(255), aluno.nome)
        .input('email', sql.VarChar(255), aluno.email)
        .query(`
          INSERT INTO Alunos (nome, email)
          VALUES (@nome, @email);

          SELECT SCOPE_IDENTITY() AS idAluno;
        `);

      const idAluno = result.recordset[0].idAluno;

      return this.findById(idAluno);
    } catch (error) {
      console.error('Erro ao criar aluno:', error.message);
      throw error;
    }
  },

  async update(id, dadosAtualizados) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAluno', sql.Int, id)
        .input('nome', sql.VarChar(255), dadosAtualizados.nome)
        .input('email', sql.VarChar(255), dadosAtualizados.email)
        .query(`
          UPDATE Alunos
          SET
            nome = @nome,
            email = @email
          WHERE idAluno = @idAluno
        `);

      if (result.rowsAffected[0] === 0) {
        return null;
      }

      return this.findById(id);
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const pool = await getPool();

      const result = await pool
        .request()
        .input('idAluno', sql.Int, id)
        .query(`
          DELETE FROM Alunos
          WHERE idAluno = @idAluno
        `);

      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Erro ao deletar aluno:', error.message);
      throw error;
    }
  },
};

module.exports = alunosService;

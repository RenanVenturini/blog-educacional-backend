require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET não definido. Configure a variável no arquivo .env.');
  process.exit(1);
}

app.use(cors({
  origin: 'http://localhost:5173',
}));

const { getPool, closePool, sql } = require('./src/config/database');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const postRoutes = require('./src/routes/postsRoutes');
const authRoutes = require('./src/routes/authRoutes');
const authService = require('./src/services/authService');

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/posts', postRoutes);

app.use(errorMiddleware.errorHandler);

const createSchema = async (pool) => {
  let schema = [
    `
    -- Criar tabela Aulas se não existir
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Aulas')
    BEGIN
        CREATE TABLE Aulas (
            idAula INT IDENTITY(1,1) PRIMARY KEY,
            titulo VARCHAR(255) NOT NULL,
            conteudo VARCHAR(MAX) NOT NULL,
            idProfessor INT NOT NULL,
            idMateria INT NOT NULL,
            dataPublicacao DATETIME DEFAULT GETDATE()
        );
    END`,
    `
    -- Criar tabela Professores se não existir
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Professores')
    BEGIN
        CREATE TABLE Professores (
            idProfessor INT IDENTITY(1,1) PRIMARY KEY,
            nome VARCHAR(255) NOT NULL
        );
    END
    `,
    `
    -- Criar tabela Materias se não existir
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Materias')
    BEGIN
        CREATE TABLE Materias (
            idMateria INT IDENTITY(1,1) PRIMARY KEY,
            nome VARCHAR(255) NOT NULL
        );
    END
    `,
    `
    -- Inserir dados de exemplo se as tabelas estiverem vazias
    IF NOT EXISTS (SELECT 1 FROM Professores)
    BEGIN
        INSERT INTO Professores (nome) VALUES ('Prof. João');
        INSERT INTO Professores (nome) VALUES ('Prof. Maria');
    END
    `,
    `
    IF NOT EXISTS (SELECT 1 FROM Materias)
    BEGIN
        INSERT INTO Materias (nome) VALUES ('Matemática');
        INSERT INTO Materias (nome) VALUES ('Português');
        INSERT INTO Materias (nome) VALUES ('História');
    END
    `,
    `
    IF COL_LENGTH('Professores', 'email') IS NULL
    BEGIN
        ALTER TABLE Professores ADD email VARCHAR(255) NULL;
    END
    `,
    `
    IF COL_LENGTH('Professores', 'senha') IS NULL
    BEGIN
        ALTER TABLE Professores ADD senha VARCHAR(255) NULL;
    END
    `]

  // for...of com await — garante execução sequencial e propagação de erros
  for (const query of schema) {
    try {
      await pool.request().query(query);
      console.log('Query executada com sucesso');
    } catch (error) {
      console.error('Erro ao executar query:', error.message);
      console.error('Query:', query);
    }
  }

}

const criarProfessorDeTeste = async (pool) => {
  const email = process.env.SEED_PROFESSOR_EMAIL || 'professor@blog.com';
  const senha = process.env.SEED_PROFESSOR_SENHA || '123456';

  try {
    const senhaHash = await authService.gerarHash(senha);

    await pool
      .request()
      .input('email', sql.VarChar(255), email)
      .input('senha', sql.VarChar(255), senhaHash)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Professores WHERE email = @email)
        BEGIN
            UPDATE Professores
            SET email = @email, senha = @senha
            WHERE idProfessor = (SELECT MIN(idProfessor) FROM Professores);
        END
      `);

    console.log(`Professor de teste disponivel: ${email}`);
  } catch (error) {
    console.error('Erro ao criar professor de teste:', error.message);
  }
};

const server = app.listen(port, async () => {
  try {
    // Tenta conectar ao banco de dados
    await getPool();
    console.log(`API rodando na porta ${port}`);
    const pool = await getPool();
    await createSchema(pool); // Chama a função para criar o schema do banco de dados
    await criarProfessorDeTeste(pool);
  } catch (error) {
    console.error('Erro ao iniciar a API:', error.message);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nEncerrando servidor...');
  server.close();
  await closePool();
  process.exit(0);
});
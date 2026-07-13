require('dotenv').config();

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const { getPool, closePool } = require('./src/config/database');
const errorMiddleware = require('./src/middlewares/errorMiddleware');
const postRoutes = require('./src/routes/postsRoutes');

app.use(express.json());

app.use('/posts', postRoutes);

app.use(errorMiddleware.errorHandler);

const server = app.listen(port, async () => {
  try {
    // Tenta conectar ao banco de dados
    await getPool();
    console.log(`API rodando na porta ${port}`);
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
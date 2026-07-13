require('dotenv').config();

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const databaseUrl = process.env.DATABASE_URL || null;

const errorMiddleware = require('./src/middlewares/errorMiddleware');
const postRoutes = require('./src/routes/postsRoutes');

app.use(express.json());

app.use('/posts', postRoutes);

app.use(errorMiddleware.errorHandler);

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
  if (databaseUrl) {
    console.log('DATABASE_URL configurada');
  }
});
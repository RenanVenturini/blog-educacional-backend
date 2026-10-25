// Monta a aplicação Express (rotas e middlewares).
// Fica separada do index.js para os testes conseguirem usar a API sem subir o servidor nem o banco.
const express = require('express');
const cors = require('cors');

const errorMiddleware = require('./middlewares/errorMiddleware');
const postRoutes = require('./routes/postsRoutes');
const authRoutes = require('./routes/authRoutes');
const materiasRoutes = require('./routes/materiasRoutes');

const app = express();

// Origens permitidas no navegador (front web e Expo Web). O app mobile nativo não passa por CORS.
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:8081')
  .split(',')
  .map((origem) => origem.trim());

app.use(cors({
  origin: corsOrigins,
}));

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/posts', postRoutes);

app.use('/materias', materiasRoutes);

app.use(errorMiddleware.errorHandler);

module.exports = app;

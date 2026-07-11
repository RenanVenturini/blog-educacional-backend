const express = require('express');

const app = express();
const port = 3000;

const errorMiddleware = require('./src/middlewares/errorMiddleware');
const postRoutes = require('./src/routes/postsRoutes');

app.use(express.json());

app.use('/posts', postRoutes);

app.use(errorMiddleware.errorHandler);

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
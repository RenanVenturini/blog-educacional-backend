exports.validatePost = (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: 'Título e conteúdo são obrigatórios',
    });
  }

  next();
};

exports.validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: 'ID inválido',
    });
  }

  next();
};

exports.errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: 'Erro interno do servidor',
  });
};

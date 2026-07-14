exports.validatePost = (req, res, next) => {
  const { titulo, conteudo, idProfessor, idMateria } = req.body;

  if (!titulo || !conteudo || !idProfessor || !idMateria) {
    return res.status(400).json({
      message: 'Título, conteúdo, professor e matéria são obrigatórios.',
    });
  }

  next();
};

exports.validateId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: 'ID inválido.',
    });
  }

  next();
};

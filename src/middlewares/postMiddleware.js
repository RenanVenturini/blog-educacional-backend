exports.validatePost = (req, res, next) => {

  console.log(req.body)

  let { titulo, conteudo, idProfessor, idMateria } = req.body;

  // Remove espaços em branco
  if (typeof titulo === 'string') titulo = titulo.trim();
  if (typeof conteudo === 'string') conteudo = conteudo.trim();

  if (!titulo || !conteudo || !idProfessor || !idMateria) {
    return res.status(400).json({
      message: 'Título, conteúdo, professor e matéria são obrigatórios.',
    });
  }

  // Atualiza o body com os valores limpos
  req.body.titulo = titulo;
  req.body.conteudo = conteudo;

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

const postsService = require('../services/postsService');

exports.validatePost = (req, res, next) => {

  console.log(req.body)

  let { titulo, conteudo, idMateria } = req.body;

  // Remove espaços em branco
  if (typeof titulo === 'string') titulo = titulo.trim();
  if (typeof conteudo === 'string') conteudo = conteudo.trim();

  if (!titulo || !conteudo || !idMateria) {
    return res.status(400).json({
      message: 'Título, conteúdo e matéria são obrigatórios.',
    });
  }

  // Atualiza o body com os valores limpos
  req.body.titulo = titulo;
  req.body.conteudo = conteudo;

  next();
};

exports.verificarAutoria = async (req, res, next) => {
  try {
    const aula = await postsService.findById(Number(req.params.id));

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada.',
      });
    }

    if (aula.idProfessor !== req.professor.idProfessor) {
      return res.status(403).json({
        message: 'Você só pode editar ou excluir as suas próprias postagens.',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
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

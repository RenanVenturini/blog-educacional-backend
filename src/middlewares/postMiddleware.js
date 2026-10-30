const postsService = require('../services/postsService');

exports.validatePost = (req, res, next) => {
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

// Comentário do aluno: precisa do nome dele e do texto
exports.validateComentario = (req, res, next) => {
  let { nome, texto } = req.body;

  if (typeof nome === 'string') nome = nome.trim();
  if (typeof texto === 'string') texto = texto.trim();

  if (!nome || !texto) {
    return res.status(400).json({
      message: 'Nome e comentário são obrigatórios.',
    });
  }

  if (nome.length > 100) {
    return res.status(400).json({
      message: 'O nome pode ter no máximo 100 caracteres.',
    });
  }

  if (texto.length > 1000) {
    return res.status(400).json({
      message: 'O comentário pode ter no máximo 1000 caracteres.',
    });
  }

  req.body.nome = nome;
  req.body.texto = texto;

  next();
};

// Resposta do professor a um comentário: precisa só do texto
exports.validateResposta = (req, res, next) => {
  let { texto } = req.body;

  if (typeof texto === 'string') texto = texto.trim();

  if (!texto) {
    return res.status(400).json({
      message: 'A resposta não pode ficar vazia.',
    });
  }

  if (texto.length > 1000) {
    return res.status(400).json({
      message: 'A resposta pode ter no máximo 1000 caracteres.',
    });
  }

  req.body.texto = texto;

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

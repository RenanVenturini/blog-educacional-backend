const comentariosService = require('../services/comentariosService');
const postsService = require('../services/postsService');

const getComentarios = async (req, res, next) => {
  try {
    const comentarios = await comentariosService.findByAula(Number(req.params.id));

    return res.status(200).json(comentarios);
  } catch (error) {
    next(error);
  }
};

// O aluno comenta sem login, informando o próprio nome
const createComentario = async (req, res, next) => {
  try {
    const idAula = Number(req.params.id);

    const aula = await postsService.findById(idAula);

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada.',
      });
    }

    const novoComentario = await comentariosService.create({
      idAula,
      nomeAluno: req.body.nome,
      texto: req.body.texto,
    });

    return res.status(201).json(novoComentario);
  } catch (error) {
    next(error);
  }
};

// O professor logado responde a um comentário (só uma resposta por comentário)
const responderComentario = async (req, res, next) => {
  try {
    const idAula = Number(req.params.id);
    const idComentario = Number(req.params.idComentario);

    if (isNaN(idComentario)) {
      return res.status(400).json({
        message: 'ID do comentário inválido.',
      });
    }

    const comentario = await comentariosService.findById(idComentario);

    // O comentário precisa existir e ser desta aula
    if (!comentario || comentario.idAula !== idAula) {
      return res.status(404).json({
        message: 'Comentário não encontrado.',
      });
    }

    if (comentario.resposta) {
      return res.status(409).json({
        message: 'Este comentário já foi respondido.',
      });
    }

    const comentarioRespondido = await comentariosService.responder(idComentario, {
      texto: req.body.texto,
      nomeProfessor: req.professor.nome,
    });

    return res.status(200).json(comentarioRespondido);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComentarios,
  createComentario,
  responderComentario,
};

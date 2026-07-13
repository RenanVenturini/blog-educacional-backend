const postsService = require('../services/postsService');

const getPosts = async (req, res, next) => {
  try {
    const aulas = await postsService.findAll();
    return res.status(200).json(aulas);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const aula = await postsService.findById(Number(id));

    if (!aula) {
      return res.status(404).json({
        message: 'Aula não encontrada.',
      });
    }

    return res.status(200).json(aula);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { titulo, conteudo, idProfessor, idMateria } = req.body;

    const novaAula = await postsService.create({
      titulo,
      conteudo,
      idProfessor,
      idMateria,
    });

    return res.status(201).json(novaAula);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { titulo, conteudo, idProfessor, idMateria } = req.body;

    const aulaAtualizada = await postsService.update(Number(id), {
      titulo,
      conteudo,
      idProfessor,
      idMateria,
    });

    if (!aulaAtualizada) {
      return res.status(404).json({
        message: 'Aula não encontrada.',
      });
    }

    return res.status(200).json(aulaAtualizada);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const removido = await postsService.delete(Number(id));

    if (!removido) {
      return res.status(404).json({
        message: 'Aula não encontrada.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const searchPosts = async (req, res, next) => {
  try {
    const { q } = req.query;

    const resultado = await postsService.search(q);

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
};

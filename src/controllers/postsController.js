const postsService = require('../services/postsService');

const getPosts = (req, res) => {
  const aulas = postsService.findAll();

  return res.status(200).json(aulas);
};

const getPostById = (req, res) => {
  const { id } = req.params;

  const aula = postsService.findById(Number(id));

  if (!aula) {
    return res.status(404).json({
      message: 'Aula não encontrada.',
    });
  }

  return res.status(200).json(aula);
};

const createPost = (req, res) => {
  const { titulo, conteudo, idProfessor, idMateria } = req.body;

  const novaAula = postsService.create({
    titulo,
    conteudo,
    idProfessor,
    idMateria,
  });

  return res.status(201).json(novaAula);
};

const updatePost = (req, res) => {
  const { id } = req.params;

  const { titulo, conteudo, idProfessor, idMateria } = req.body;

  const aulaAtualizada = postsService.update(Number(id), {
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
};

const deletePost = (req, res) => {
  const { id } = req.params;

  const removido = postsService.delete(Number(id));

  if (!removido) {
    return res.status(404).json({
      message: 'Aula não encontrada.',
    });
  }

  return res.status(204).send();
};

const searchPosts = (req, res) => {
  const { q } = req.query;

  const resultado = postsService.search(q);

  return res.status(200).json(resultado);
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
};

const postsService = require('../services/postsService');

const postsController = {
  getPosts(req, res) {
    const posts = postsService.findAll();

    return res.status(200).json(posts);
  },

  getPostById(req, res) {

    const { id } = req.params;

    const post = postsService.findById(id);

    return res.status(200).json(post);
  },

  createPost(req, res) {
    const novoPost = postsService.create(req.body);

    return res.status(201).json(novoPost);
  },

  updatePost(req, res) {
    const { id } = req.params;

    const postAtualizado = postsService.update(Number(id), req.body);

    if (!postAtualizado) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    return res.status(200).json(postAtualizado);
  },

  deletePost(req, res) {
    const { id } = req.params;

    const deletado = postsService.delete(Number(id));

    if (!deletado) {
      return res.status(404).json({ message: 'Post não encontrado' });
    }

    return res.status(204).send();
  },

  searchPosts(req, res) {
    const { termo } = req.query;

    const posts = postsService.search(termo);

    return res.status(200).json(posts);
  }
};

module.exports = postsController;

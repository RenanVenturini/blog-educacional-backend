const express = require('express');

const router = express.Router();

const postController = require('../controllers/postsController');
const comentariosController = require('../controllers/comentariosController');

const postMiddleware = require('../middlewares/postMiddleware');

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/search', postController.searchPosts);

router.get('/', postController.getPosts);

router.get('/:id', postMiddleware.validateId, postController.getPostById);

// Criar, editar e excluir exige login (só professores fazem login); ler é público
router.post('/', authMiddleware.verificarToken, postMiddleware.validatePost, postController.createPost);

router.put('/:id', authMiddleware.verificarToken, postMiddleware.validateId, postMiddleware.verificarAutoria, postMiddleware.validatePost, postController.updatePost);

router.delete('/:id', authMiddleware.verificarToken, postMiddleware.validateId, postMiddleware.verificarAutoria, postController.deletePost);

// Comentários: qualquer um lê e o aluno comenta informando o nome (sem login).
// O professor (logado) responde ao comentário do aluno — uma resposta por comentário.
router.get('/:id/comentarios', postMiddleware.validateId, comentariosController.getComentarios);

router.post('/:id/comentarios', postMiddleware.validateId, postMiddleware.validateComentario, comentariosController.createComentario);

router.post('/:id/comentarios/:idComentario/resposta', authMiddleware.verificarToken, postMiddleware.validateId, postMiddleware.validateResposta, comentariosController.responderComentario);

module.exports = router;


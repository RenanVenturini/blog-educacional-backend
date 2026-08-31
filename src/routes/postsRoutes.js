const express = require('express');

const router = express.Router();

const postController = require('../controllers/postsController');

const postMiddleware = require('../middlewares/postMiddleware');

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/search', postController.searchPosts);

router.get('/', postController.getPosts);

router.get('/:id', postMiddleware.validateId, postController.getPostById);

router.post('/', authMiddleware.verificarToken, postMiddleware.validatePost, postController.createPost);

router.put('/:id', authMiddleware.verificarToken, postMiddleware.validateId, postMiddleware.verificarAutoria, postMiddleware.validatePost, postController.updatePost);

router.delete('/:id', authMiddleware.verificarToken, postMiddleware.validateId, postMiddleware.verificarAutoria, postController.deletePost);

module.exports = router;


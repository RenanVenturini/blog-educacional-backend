const express = require('express');

const router = express.Router();

const postController = require('../controllers/postsController');

const postMiddleware = require('../middlewares/postMiddleware');

router.get('/search', postController.searchPosts);

router.get('/', postController.getPosts);

router.get('/:id', postMiddleware.validateId, postController.getPostById);

router.post('/', postMiddleware.validatePost, postController.createPost);

router.put('/:id', postMiddleware.validateId, postMiddleware.validatePost, postController.updatePost);

router.delete('/:id', postMiddleware.validateId, postController.deletePost);

module.exports = router;


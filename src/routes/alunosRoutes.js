const express = require('express');

const router = express.Router();

const alunosController = require('../controllers/alunosController');

const authMiddleware = require('../middlewares/authMiddleware');
const postMiddleware = require('../middlewares/postMiddleware');
const usuarioMiddleware = require('../middlewares/usuarioMiddleware');

// Todas as rotas de alunos são administrativas: exigem login de professor
router.use(authMiddleware.verificarToken);

router.get('/', usuarioMiddleware.validatePaginacao, alunosController.getAlunos);

router.get('/:id', postMiddleware.validateId, alunosController.getAlunoById);

router.post('/', usuarioMiddleware.validateUsuario, alunosController.createAluno);

router.put('/:id', postMiddleware.validateId, usuarioMiddleware.validateUsuario, alunosController.updateAluno);

router.delete('/:id', postMiddleware.validateId, alunosController.deleteAluno);

module.exports = router;

const express = require('express');

const router = express.Router();

const professoresController = require('../controllers/professoresController');

const authMiddleware = require('../middlewares/authMiddleware');
const postMiddleware = require('../middlewares/postMiddleware');
const usuarioMiddleware = require('../middlewares/usuarioMiddleware');

// Todas as rotas de professores são administrativas: exigem login de professor
router.use(authMiddleware.verificarToken);

router.get('/', usuarioMiddleware.validatePaginacao, professoresController.getProfessores);

router.get('/:id', postMiddleware.validateId, professoresController.getProfessorById);

// Professores têm senha (para fazer login); alunos não
router.post('/', usuarioMiddleware.validateUsuario, usuarioMiddleware.validateSenha, professoresController.createProfessor);

router.put('/:id', postMiddleware.validateId, usuarioMiddleware.validateUsuario, usuarioMiddleware.validateSenha, professoresController.updateProfessor);

router.delete('/:id', postMiddleware.validateId, usuarioMiddleware.podeExcluirProfessor, professoresController.deleteProfessor);

module.exports = router;

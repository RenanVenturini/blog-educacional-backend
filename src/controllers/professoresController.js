const professoresService = require('../services/professoresService');
const authService = require('../services/authService');

const getProfessores = async (req, res, next) => {
  try {
    const { pagina, limite } = req.paginacao;

    const resultado = await professoresService.findAll(pagina, limite);

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const getProfessorById = async (req, res, next) => {
  try {
    const professor = await professoresService.findById(Number(req.params.id));

    if (!professor) {
      return res.status(404).json({
        message: 'Professor não encontrado.',
      });
    }

    return res.status(200).json(professor);
  } catch (error) {
    next(error);
  }
};

const createProfessor = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;

    // O e-mail é o login, então não pode existir em outro professor nem em aluno
    const usuarioExistente = await authService.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({
        message: 'Este e-mail já está cadastrado.',
      });
    }

    const novoProfessor = await professoresService.create({ nome, email, senha });

    return res.status(201).json(novoProfessor);
  } catch (error) {
    next(error);
  }
};

const updateProfessor = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, senha } = req.body;

    // Pode manter o próprio e-mail, mas não usar o de outra pessoa
    const usuarioExistente = await authService.buscarPorEmail(email);
    const ehOProprioProfessor = usuarioExistente
      && usuarioExistente.perfil === 'professor'
      && usuarioExistente.id === id;

    if (usuarioExistente && !ehOProprioProfessor) {
      return res.status(409).json({
        message: 'Este e-mail já está cadastrado.',
      });
    }

    const professorAtualizado = await professoresService.update(id, { nome, email, senha });

    if (!professorAtualizado) {
      return res.status(404).json({
        message: 'Professor não encontrado.',
      });
    }

    return res.status(200).json(professorAtualizado);
  } catch (error) {
    next(error);
  }
};

const deleteProfessor = async (req, res, next) => {
  try {
    const removido = await professoresService.delete(Number(req.params.id));

    if (!removido) {
      return res.status(404).json({
        message: 'Professor não encontrado.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfessores,
  getProfessorById,
  createProfessor,
  updateProfessor,
  deleteProfessor,
};

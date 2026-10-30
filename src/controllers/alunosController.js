const alunosService = require('../services/alunosService');
const authService = require('../services/authService');

const getAlunos = async (req, res, next) => {
  try {
    const { pagina, limite } = req.paginacao;

    const resultado = await alunosService.findAll(pagina, limite);

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const getAlunoById = async (req, res, next) => {
  try {
    const aluno = await alunosService.findById(Number(req.params.id));

    if (!aluno) {
      return res.status(404).json({
        message: 'Aluno não encontrado.',
      });
    }

    return res.status(200).json(aluno);
  } catch (error) {
    next(error);
  }
};

const createAluno = async (req, res, next) => {
  try {
    const { nome, email } = req.body;

    // O e-mail não pode se repetir entre alunos e professores
    const usuarioExistente = await authService.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({
        message: 'Este e-mail já está cadastrado.',
      });
    }

    const novoAluno = await alunosService.create({ nome, email });

    return res.status(201).json(novoAluno);
  } catch (error) {
    next(error);
  }
};

const updateAluno = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nome, email } = req.body;

    // Pode manter o próprio e-mail, mas não usar o de outra pessoa
    const usuarioExistente = await authService.buscarPorEmail(email);
    const ehOProprioAluno = usuarioExistente
      && usuarioExistente.perfil === 'aluno'
      && usuarioExistente.id === id;

    if (usuarioExistente && !ehOProprioAluno) {
      return res.status(409).json({
        message: 'Este e-mail já está cadastrado.',
      });
    }

    const alunoAtualizado = await alunosService.update(id, { nome, email });

    if (!alunoAtualizado) {
      return res.status(404).json({
        message: 'Aluno não encontrado.',
      });
    }

    return res.status(200).json(alunoAtualizado);
  } catch (error) {
    next(error);
  }
};

const deleteAluno = async (req, res, next) => {
  try {
    const removido = await alunosService.delete(Number(req.params.id));

    if (!removido) {
      return res.status(404).json({
        message: 'Aluno não encontrado.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlunos,
  getAlunoById,
  createAluno,
  updateAluno,
  deleteAluno,
};

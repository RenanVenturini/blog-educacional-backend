const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        message: 'E-mail e senha são obrigatórios.',
      });
    }

    const resultado = await authService.autenticar(email, senha);

    if (!resultado) {
      return res.status(401).json({
        message: 'E-mail ou senha inválidos.',
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

const perfil = async (req, res) => {
  return res.status(200).json({
    professor: {
      idProfessor: req.professor.idProfessor,
      nome: req.professor.nome,
      email: req.professor.email,
    },
  });
};

module.exports = { login, perfil };

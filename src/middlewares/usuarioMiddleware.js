const professoresService = require('../services/professoresService');

// Validação simples de e-mail: precisa ter algo antes do "@",
// um "." depois do "@" (com algo depois dele) e nenhum espaço
function emailValido(email) {
  const posicaoArroba = email.indexOf('@');
  const posicaoPonto = email.lastIndexOf('.');

  return posicaoArroba > 0
    && posicaoPonto > posicaoArroba + 1
    && posicaoPonto < email.length - 1
    && !email.includes(' ');
}

// Valida o cadastro e a edição de professores e alunos
exports.validateUsuario = (req, res, next) => {
  let { nome, email } = req.body;

  // Remove espaços em branco e padroniza o e-mail em minúsculas
  if (typeof nome === 'string') nome = nome.trim();
  if (typeof email === 'string') email = email.trim().toLowerCase();

  if (!nome || !email) {
    return res.status(400).json({
      message: 'Nome e e-mail são obrigatórios.',
    });
  }

  if (!emailValido(email)) {
    return res.status(400).json({
      message: 'E-mail inválido.',
    });
  }

  // Atualiza o body com os valores limpos
  req.body.nome = nome;
  req.body.email = email;

  next();
};

// Só para professores (alunos não fazem login, então não têm senha)
exports.validateSenha = (req, res, next) => {
  const { senha } = req.body;

  // No cadastro (POST) a senha é obrigatória; na edição (PUT) é opcional
  if (req.method === 'POST' && !senha) {
    return res.status(400).json({
      message: 'Senha é obrigatória.',
    });
  }

  if (senha && (typeof senha !== 'string' || senha.length < 6)) {
    return res.status(400).json({
      message: 'A senha deve ter pelo menos 6 caracteres.',
    });
  }

  next();
};

// Lê ?pagina=1&limite=10 da URL (com valores padrão) e guarda em req.paginacao
exports.validatePaginacao = (req, res, next) => {
  const pagina = Number(req.query.pagina || 1);
  const limite = Number(req.query.limite || 10);

  if (!Number.isInteger(pagina) || pagina < 1) {
    return res.status(400).json({
      message: 'Página inválida.',
    });
  }

  if (!Number.isInteger(limite) || limite < 1 || limite > 50) {
    return res.status(400).json({
      message: 'O limite deve ser entre 1 e 50.',
    });
  }

  req.paginacao = { pagina, limite };

  next();
};

exports.podeExcluirProfessor = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (id === req.professor.idProfessor) {
      return res.status(400).json({
        message: 'Você não pode excluir a sua própria conta.',
      });
    }

    const totalAulas = await professoresService.contarAulas(id);

    if (totalAulas > 0) {
      return res.status(409).json({
        message: 'Este professor possui postagens. Exclua as postagens dele antes de removê-lo.',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

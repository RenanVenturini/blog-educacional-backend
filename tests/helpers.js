const jwt = require('jsonwebtoken');

// Gera o token de um professor de teste, como se ele tivesse feito login
function tokenDeProfessor(professor = { idProfessor: 1, nome: 'Prof. Teste', email: 'prof@teste.com' }) {
  return jwt.sign(professor, process.env.JWT_SECRET);
}

// Cria objetos req/res falsos para testar middlewares sem subir a API
function criarReqRes(req = {}) {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();

  return { req: { body: {}, params: {}, query: {}, ...req }, res, next };
}

module.exports = { tokenDeProfessor, criarReqRes };

const postMiddleware = require('../src/middlewares/postMiddleware');
const usuarioMiddleware = require('../src/middlewares/usuarioMiddleware');
const { criarReqRes } = require('./helpers');

describe('postMiddleware.validatePost', () => {
  test('aceita uma postagem completa e remove espaços extras', () => {
    const { req, res, next } = criarReqRes({ body: { titulo: '  Frações  ', conteudo: ' Texto ', idMateria: 1 } });

    postMiddleware.validatePost(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.titulo).toBe('Frações');
    expect(req.body.conteudo).toBe('Texto');
  });

  test('recusa postagem sem matéria', () => {
    const { req, res, next } = criarReqRes({ body: { titulo: 'Frações', conteudo: 'Texto' } });

    postMiddleware.validatePost(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('postMiddleware.validateId', () => {
  test('recusa ID que não é número', () => {
    const { req, res, next } = criarReqRes({ params: { id: 'abc' } });

    postMiddleware.validateId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('aceita ID numérico', () => {
    const { req, res, next } = criarReqRes({ params: { id: '10' } });

    postMiddleware.validateId(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe('postMiddleware.validateComentario', () => {
  test('exige o nome do aluno', () => {
    const { req, res, next } = criarReqRes({ body: { texto: 'Gostei!' } });

    postMiddleware.validateComentario(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('recusa comentário com mais de 1000 caracteres', () => {
    const { req, res, next } = criarReqRes({ body: { nome: 'Ana', texto: 'a'.repeat(1001) } });

    postMiddleware.validateComentario(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('aceita nome e texto', () => {
    const { req, res, next } = criarReqRes({ body: { nome: ' Ana ', texto: ' Gostei! ' } });

    postMiddleware.validateComentario(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.nome).toBe('Ana');
  });
});

describe('usuarioMiddleware.validateUsuario', () => {
  test('padroniza o e-mail em minúsculas', () => {
    const { req, res, next } = criarReqRes({ body: { nome: 'Ana', email: ' ANA@Escola.com ' } });

    usuarioMiddleware.validateUsuario(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.email).toBe('ana@escola.com');
  });

  test('recusa e-mail inválido', () => {
    const { req, res, next } = criarReqRes({ body: { nome: 'Ana', email: 'ana-escola' } });

    usuarioMiddleware.validateUsuario(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('usuarioMiddleware.validateSenha', () => {
  test('senha é obrigatória no cadastro de professor', () => {
    const { req, res, next } = criarReqRes({ method: 'POST', body: {} });

    usuarioMiddleware.validateSenha(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('senha é opcional na edição', () => {
    const { req, res, next } = criarReqRes({ method: 'PUT', body: {} });

    usuarioMiddleware.validateSenha(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test('recusa senha com menos de 6 caracteres', () => {
    const { req, res, next } = criarReqRes({ method: 'POST', body: { senha: '123' } });

    usuarioMiddleware.validateSenha(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('usuarioMiddleware.validatePaginacao', () => {
  test('usa página 1 e limite 10 quando não informados', () => {
    const { req, res, next } = criarReqRes();

    usuarioMiddleware.validatePaginacao(req, res, next);

    expect(req.paginacao).toEqual({ pagina: 1, limite: 10 });
  });

  test('recusa limite acima de 50', () => {
    const { req, res, next } = criarReqRes({ query: { limite: '100' } });

    usuarioMiddleware.validatePaginacao(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

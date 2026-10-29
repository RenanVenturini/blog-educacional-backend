const request = require('supertest');

jest.mock('../src/config/database');
jest.mock('../src/services/postsService');
jest.mock('../src/services/comentariosService');

const app = require('../src/app');
const postsService = require('../src/services/postsService');
const comentariosService = require('../src/services/comentariosService');
const { tokenDeProfessor } = require('./helpers');

const comentario = {
  idComentario: 10,
  idAula: 1,
  nomeAluno: 'Ana',
  texto: 'Gostei!',
  resposta: null,
  nomeProfessorResposta: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Comentário do aluno (sem login)', () => {
  test('aluno comenta informando o nome', async () => {
    postsService.findById.mockResolvedValue({ idAula: 1 });
    comentariosService.create.mockResolvedValue(comentario);

    const resposta = await request(app).post('/posts/1/comentarios').send({ nome: 'Ana', texto: 'Gostei!' });

    expect(resposta.status).toBe(201);
    expect(comentariosService.create).toHaveBeenCalledWith({ idAula: 1, nomeAluno: 'Ana', texto: 'Gostei!' });
  });

  test('comentário sem nome devolve 400', async () => {
    const resposta = await request(app).post('/posts/1/comentarios').send({ texto: 'Gostei!' });

    expect(resposta.status).toBe(400);
    expect(comentariosService.create).not.toHaveBeenCalled();
  });

  test('comentário em aula que não existe devolve 404', async () => {
    postsService.findById.mockResolvedValue(null);

    const resposta = await request(app).post('/posts/99/comentarios').send({ nome: 'Ana', texto: 'Oi' });

    expect(resposta.status).toBe(404);
  });
});

describe('Resposta do professor', () => {
  test('responder sem login devolve 401', async () => {
    const resposta = await request(app).post('/posts/1/comentarios/10/resposta').send({ texto: 'Obrigado!' });

    expect(resposta.status).toBe(401);
  });

  test('professor logado responde com o próprio nome', async () => {
    comentariosService.findById.mockResolvedValue(comentario);
    comentariosService.responder.mockResolvedValue({ ...comentario, resposta: 'Obrigado!' });

    const resposta = await request(app)
      .post('/posts/1/comentarios/10/resposta')
      .set('Authorization', `Bearer ${tokenDeProfessor()}`)
      .send({ texto: 'Obrigado!' });

    expect(resposta.status).toBe(200);
    expect(comentariosService.responder).toHaveBeenCalledWith(10, { texto: 'Obrigado!', nomeProfessor: 'Prof. Teste' });
  });

  test('comentário já respondido devolve 409 (só uma resposta por comentário)', async () => {
    comentariosService.findById.mockResolvedValue({ ...comentario, resposta: 'Já respondi' });

    const resposta = await request(app)
      .post('/posts/1/comentarios/10/resposta')
      .set('Authorization', `Bearer ${tokenDeProfessor()}`)
      .send({ texto: 'De novo' });

    expect(resposta.status).toBe(409);
    expect(comentariosService.responder).not.toHaveBeenCalled();
  });

  test('comentário de outra aula devolve 404', async () => {
    comentariosService.findById.mockResolvedValue({ ...comentario, idAula: 2 });

    const resposta = await request(app)
      .post('/posts/1/comentarios/10/resposta')
      .set('Authorization', `Bearer ${tokenDeProfessor()}`)
      .send({ texto: 'Oi' });

    expect(resposta.status).toBe(404);
  });
});

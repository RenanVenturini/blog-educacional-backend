const request = require('supertest');

jest.mock('../src/config/database');
jest.mock('../src/services/authService');
jest.mock('../src/services/professoresService');
jest.mock('../src/services/alunosService');

const app = require('../src/app');
const authService = require('../src/services/authService');
const professoresService = require('../src/services/professoresService');
const alunosService = require('../src/services/alunosService');
const { tokenDeProfessor } = require('./helpers');

const token = tokenDeProfessor();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Login', () => {
  test('sem e-mail ou senha devolve 400', async () => {
    const resposta = await request(app).post('/auth/login').send({ email: 'prof@teste.com' });

    expect(resposta.status).toBe(400);
  });

  test('credenciais erradas devolvem 401', async () => {
    authService.autenticar.mockResolvedValue(null);

    const resposta = await request(app).post('/auth/login').send({ email: 'prof@teste.com', senha: 'errada' });

    expect(resposta.status).toBe(401);
  });

  test('login certo devolve o token', async () => {
    authService.autenticar.mockResolvedValue({ token: 'abc', professor: { idProfessor: 1 } });

    const resposta = await request(app).post('/auth/login').send({ email: 'prof@teste.com', senha: '123456' });

    expect(resposta.status).toBe(200);
    expect(resposta.body.token).toBe('abc');
  });
});

describe('Alunos (cadastro sem senha)', () => {
  test('rotas de alunos exigem login', async () => {
    const resposta = await request(app).get('/alunos');

    expect(resposta.status).toBe(401);
  });

  test('cadastra aluno só com nome e e-mail', async () => {
    authService.buscarPorEmail.mockResolvedValue(null);
    alunosService.create.mockResolvedValue({ idAluno: 5, nome: 'Ana', email: 'ana@escola.com' });

    const resposta = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Ana', email: 'ana@escola.com' });

    expect(resposta.status).toBe(201);
    expect(alunosService.create).toHaveBeenCalledWith({ nome: 'Ana', email: 'ana@escola.com' });
  });

  test('e-mail já usado devolve 409', async () => {
    authService.buscarPorEmail.mockResolvedValue({ perfil: 'professor', id: 1 });

    const resposta = await request(app)
      .post('/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Ana', email: 'prof@teste.com' });

    expect(resposta.status).toBe(409);
    expect(alunosService.create).not.toHaveBeenCalled();
  });

  test('listagem usa a paginação da URL', async () => {
    alunosService.findAll.mockResolvedValue({ dados: [], pagina: 2, limite: 5, total: 0, totalPaginas: 0 });

    const resposta = await request(app)
      .get('/alunos?pagina=2&limite=5')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(200);
    expect(alunosService.findAll).toHaveBeenCalledWith(2, 5);
  });
});

describe('Professores (cadastro com senha)', () => {
  test('cadastro sem senha devolve 400', async () => {
    const resposta = await request(app)
      .post('/professores')
      .set('Authorization', `Bearer ${token}`)
      .send({ nome: 'Novo Prof', email: 'novo@escola.com' });

    expect(resposta.status).toBe(400);
    expect(professoresService.create).not.toHaveBeenCalled();
  });

  test('professor não pode excluir a própria conta', async () => {
    const resposta = await request(app)
      .delete('/professores/1')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(400);
  });

  test('professor com postagens não pode ser excluído', async () => {
    professoresService.contarAulas.mockResolvedValue(3);

    const resposta = await request(app)
      .delete('/professores/2')
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(409);
    expect(professoresService.delete).not.toHaveBeenCalled();
  });
});

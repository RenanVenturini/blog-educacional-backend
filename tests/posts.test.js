const request = require('supertest');

// Os services são substituídos por versões falsas: os testes não acessam o banco
jest.mock('../src/config/database');
jest.mock('../src/services/postsService');
jest.mock('../src/services/comentariosService');

const app = require('../src/app');
const postsService = require('../src/services/postsService');
const comentariosService = require('../src/services/comentariosService');
const { tokenDeProfessor } = require('./helpers');

const aula = {
  idAula: 1,
  titulo: 'Frações',
  conteudo: 'Conteúdo da aula',
  idProfessor: 1,
  idMateria: 1,
  nomeProfessor: 'Prof. Teste',
  nomeMateria: 'Matemática',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Leitura de postagens (pública)', () => {
  test('GET /posts lista as postagens', async () => {
    postsService.findAll.mockResolvedValue([aula]);

    const resposta = await request(app).get('/posts');

    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(1);
    expect(resposta.body[0].titulo).toBe('Frações');
  });

  test('GET /posts/:id devolve 404 quando a aula não existe', async () => {
    postsService.findById.mockResolvedValue(null);

    const resposta = await request(app).get('/posts/99');

    expect(resposta.status).toBe(404);
  });

  test('GET /posts/search repassa o termo da busca', async () => {
    postsService.search.mockResolvedValue([aula]);

    const resposta = await request(app).get('/posts/search?q=frações');

    expect(resposta.status).toBe(200);
    expect(postsService.search).toHaveBeenCalledWith('frações');
  });
});

describe('Criação, edição e exclusão (só professor logado)', () => {
  test('POST /posts sem token devolve 401', async () => {
    const resposta = await request(app).post('/posts').send({ titulo: 'A', conteudo: 'B', idMateria: 1 });

    expect(resposta.status).toBe(401);
    expect(postsService.create).not.toHaveBeenCalled();
  });

  test('POST /posts com token cria a aula no nome do professor logado', async () => {
    postsService.create.mockResolvedValue(aula);

    const resposta = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${tokenDeProfessor()}`)
      .send({ titulo: 'Frações', conteudo: 'Conteúdo da aula', idMateria: 1 });

    expect(resposta.status).toBe(201);
    expect(postsService.create).toHaveBeenCalledWith(expect.objectContaining({ idProfessor: 1 }));
  });

  test('PUT /posts/:id de outro professor devolve 403', async () => {
    postsService.findById.mockResolvedValue({ ...aula, idProfessor: 2 });

    const resposta = await request(app)
      .put('/posts/1')
      .set('Authorization', `Bearer ${tokenDeProfessor()}`)
      .send({ titulo: 'Novo', conteudo: 'Novo', idMateria: 1 });

    expect(resposta.status).toBe(403);
    expect(postsService.update).not.toHaveBeenCalled();
  });

  test('DELETE /posts/:id do próprio professor apaga a aula e os comentários', async () => {
    postsService.findById.mockResolvedValue(aula);
    postsService.delete.mockResolvedValue(true);

    const resposta = await request(app)
      .delete('/posts/1')
      .set('Authorization', `Bearer ${tokenDeProfessor()}`);

    expect(resposta.status).toBe(204);
    expect(comentariosService.deleteByAula).toHaveBeenCalledWith(1);
    expect(postsService.delete).toHaveBeenCalledWith(1);
  });
});

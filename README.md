# 📚 Blog Educacional

## Tech Challenge — Fase 4 | FIAP | Grupo 4

Projeto desenvolvido durante a Pós-Graduação FIAP em **Full Stack Development**.

O objetivo deste projeto é desenvolver uma plataforma de conteúdos educacionais, em que professores publicam aulas e alunos consultam e comentam os conteúdos disponibilizados.

O repositório reúne as três partes do projeto:

| Pasta | Conteúdo | Documentação |
| --- | --- | --- |
| `/` (raiz) | API REST em Node.js + SQL Server | este README |
| `frontend/` | Front-end web em React | [`frontend/README.md`](frontend/README.md) |
| `mobile/` | App mobile em React Native (Expo) — **Fase 4** | [`mobile/README.md`](mobile/README.md) |

---

# 👥 Integrantes - Grupo 4

- Gabrielle Carvalho
- Renan Venturini
- Amanda Rodrigues

---

# 📝 Descrição do Projeto

O Blog Educacional é uma API backend responsável pelo gerenciamento de aulas e conteúdos educacionais.

A solução foi desenvolvida utilizando Node.js e Express.js, com persistência de dados em SQL Server, executado através de containers Docker.

O sistema permite que professores disponibilizem conteúdos educacionais para alunos através de aulas cadastradas.

## Funcionalidades

✅ Cadastro, listagem, busca, consulta, atualização e exclusão de aulas  
✅ Login de professores (JWT)  
✅ Cadastro, edição, exclusão e listagem paginada de professores e alunos  
✅ Comentários dos alunos nas aulas e resposta do professor  
✅ Testes automatizados (Jest) e CI no GitHub Actions

## Perfis de acesso

| Perfil | Login | O que pode fazer |
| --- | --- | --- |
| **Aluno** | não faz login | ler e pesquisar aulas; comentar informando o nome |
| **Professor** | e-mail e senha | tudo do aluno + criar/editar/excluir as próprias aulas, responder comentários e gerenciar professores e alunos |

Os alunos acessam sem login e **apenas visualizam** as aulas: a API recusa (`401`) qualquer criação, edição ou exclusão feita sem o token de um professor.

Cada aula possui:

- Título;
- Conteúdo;
- Professor responsável;
- Matéria relacionada;
- Data de publicação.

---

# 🏗️ Documentação da Arquitetura

A aplicação utiliza uma arquitetura baseada em camadas, permitindo melhor organização, manutenção e separação das responsabilidades.

## Fluxo da aplicação

```
Cliente
   |
   | Requisições HTTP
   |
   ▼
Routes
   |
   ▼
Middlewares
   |
   ▼
Controllers
   |
   ▼
Services
   |
   ▼
SQL Server Database
```

---

## 📌 Routes

Responsável pelo gerenciamento dos endpoints da API.

Exemplo:

```
POST /posts
GET /posts
GET /posts/:id
PUT /posts/:id
DELETE /posts/:id
```

---

## 📌 Middlewares

Responsáveis pelas validações antes da execução das operações.

Exemplos:

- Validação de campos obrigatórios;
- Validação de IDs recebidos.

---

## 📌 Controllers

Responsável pelo controle das requisições HTTP.

Funções:

- Receber dados enviados pelo cliente;
- Encaminhar para os serviços;
- Retornar respostas com status HTTP adequado.

---

## 📌 Services

Responsável pelas regras de negócio da aplicação.

Funções:

- Criar aulas;
- Consultar informações;
- Atualizar registros;
- Excluir dados.

---

# 🗄️ Banco de Dados

Banco utilizado:

```
BlogEducacional
```

Tecnologia:

```
Microsoft SQL Server 2022
```

O banco é executado utilizando Docker.

---

## Modelo de Dados

### Tabela Aulas

```
Aulas
--------------------------------
IdAula
Titulo
Conteudo
IdProfessor
IdMateria
DataPublicacao
```

---

### Tabela Professor

```
Professor
--------------------------------
IdProfessor
NomeProfessor
Email
Senha (hash bcrypt)
```

---

### Tabela Alunos

```
Alunos
--------------------------------
IdAluno
Nome
Email
```

Alunos não fazem login, por isso não têm senha.

---

### Tabela Materia

```
Materia
--------------------------------
IdMateria
NomeMateria
```

---

### Tabela Comentarios

```
Comentarios
--------------------------------
IdComentario
IdAula
NomeAluno                (informado pelo aluno ao comentar)
Texto                    (até 1000 caracteres)
DataComentario
Resposta                 (resposta do professor — opcional, só uma)
NomeProfessorResposta
DataResposta
```

Cada linha guarda o comentário do aluno e, se houver, a resposta do professor.

---

## Relacionamentos

```
Professor
     |
     | 1:N
     |
   Aulas ---- 1:N ---- Comentarios
     |
     | N:1
     |
  Materia
```

Ao excluir uma aula, os comentários dela são excluídos junto.

---

# 🛠️ Tecnologias Utilizadas

## Backend

- Node.js
- Express.js
- JavaScript
- API REST

## Banco de Dados

- Microsoft SQL Server 2022
- Docker
- Docker Compose

## Testes e CI

- Jest + Supertest (testes automatizados da API)
- GitHub Actions (testes, checagem de tipos e build das imagens Docker)

## Ferramentas

- Git
- GitHub
- Postman
- Visual Studio Code

---

# 📂 Estrutura do Projeto

```
blog-educacional-backend
├── index.js                   inicia o servidor, cria as tabelas e os dados de exemplo
├── src
│   ├── app.js                 monta a API (rotas e middlewares) — usado também pelos testes
│   ├── config
│   │   └── database.js
│   ├── controllers
│   │   ├── alunosController.js
│   │   ├── authController.js
│   │   ├── comentariosController.js
│   │   ├── postsController.js
│   │   └── professoresController.js
│   ├── middlewares
│   │   ├── authMiddleware.js   (verificarToken)
│   │   ├── errorMiddleware.js
│   │   ├── postMiddleware.js
│   │   └── usuarioMiddleware.js
│   ├── models
│   ├── routes
│   │   ├── alunosRoutes.js
│   │   ├── authRoutes.js
│   │   ├── materiasRoutes.js
│   │   ├── postsRoutes.js
│   │   └── professoresRoutes.js
│   └── services
│       ├── alunosService.js
│       ├── authService.js
│       ├── comentariosService.js
│       ├── postsService.js
│       └── professoresService.js
├── tests/                     testes automatizados (Jest + Supertest)
├── frontend/                  front-end web (React) — com Dockerfile próprio
├── mobile/                    app mobile (React Native / Expo)
├── .github/workflows/Main.yml CI: testes, checagem de tipos e imagens Docker
├── Dockerfile                 imagem da API
├── docker-compose.yml         banco + API + front-end
├── package.json
└── .env.example
```

---

# ⚙️ Instalação

## Pré-requisitos

Antes de iniciar, tenha instalado:

- Node.js
- Docker Desktop
- Git

---

## 1. Clonar o repositório

```bash
git clone  https://github.com/RenanVenturini/blog-educacional-backend.git
```

Acesse a pasta:

```bash
cd blog-educacional-backend
```

---

## 2. Instalar dependências

Execute:

```bash
npm install
```

---

## 3. Criar o arquivo `.env`

**Passo obrigatório.** O `.env` não vai para o repositório (contém segredos), e sem ele o Docker Compose falha. Copie o modelo:

```bash
cp .env.example .env
```

No Windows (PowerShell):

```powershell
Copy-Item .env.example .env
```

Os valores padrão do modelo já funcionam para desenvolvimento local — não é preciso editar nada para rodar. As variáveis são:

| Variável | Para que serve |
| --- | --- |
| `PORT` | porta da API (3000) |
| `DB_USER`, `DB_NAME`, `DB_PORT` | credenciais do SQL Server |
| `DB_PASSWORD` | **obrigatório** — senha do SQL Server; a API não sobe sem ele (não há senha padrão no código) |
| `DB_SERVER` | `localhost` para rodar a API na máquina; o Compose usa `database` dentro do container |
| `JWT_SECRET` | **obrigatório** — segredo que assina os tokens de login; a API não sobe sem ele |
| `JWT_EXPIRES_IN` | validade do token (8h) |
| `CORS_ORIGINS` | origens de navegador liberadas, separadas por vírgula (padrão: front web `5173` e Expo Web `8081`) |

Para um ambiente real, gere um segredo próprio:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

O banco (`BlogEducacional`), as tabelas e os dados de exemplo são criados automaticamente no primeiro start da API — não há script de migração para rodar à mão.

---

## 4. Subir o banco, a API e o front-end

```bash
docker compose up -d --build
```

Esse comando sobe **três containers**: o SQL Server, a API e o front-end web. O container da API aguarda o banco ficar saudável antes de iniciar (leva cerca de 40 segundos no primeiro start, enquanto o SQL Server inicializa).

Verificar:

```bash
docker compose ps
```

Containers esperados:

```
blog-educacional-db         Up (healthy)
blog-educacional-api        Up
blog-educacional-frontend   Up
```

Acompanhar o log da API:

```bash
docker compose logs -f api
```

Deve aparecer `Conectado ao banco de dados SQL Server` e uma linha `Professor de teste disponivel:` para cada professor.

| Serviço | Endereço |
| --- | --- |
| API | **http://localhost:3000** |
| Front-end web | **http://localhost:5173** |

> Não rode `npm run dev` (API ou front-end) junto com os containers: as portas 3000 e 5173 já estão em uso e a segunda instância falha.

Credenciais de teste criadas automaticamente:

```
Prof. João    joao@blog.com    joao123
Prof. Maria   maria@blog.com   maria123
```

Também é criado um aluno de exemplo (Ana Souza, `ana@blog.com`), que aparece na listagem de alunos. Alunos não fazem login.

Cada professor entra com o próprio login, e as postagens criadas ficam automaticamente no nome de quem está autenticado.

---

## 5. Front-end web em modo de desenvolvimento (opcional)

Para editar o front-end com recarregamento automático, pare o container dele e rode pelo Vite:

```bash
docker compose stop frontend
cd frontend
npm install
npm run dev
```

A interface abre em **http://localhost:5173** — a porta precisa ser essa, porque é uma das origens liberadas no CORS da API (`CORS_ORIGINS`).

A documentação técnica do front-end (arquitetura, rotas e guia de uso) está em **[`frontend/README.md`](frontend/README.md)**.

---

## 6. Executar o app mobile (Fase 4)

O app React Native (Expo) fica na pasta `mobile/`, em outro terminal:

```bash
cd mobile
npm install
npm start
```

Instale o app **Expo Go** no celular, conecte-o **na mesma rede Wi-Fi do computador** e abra o QR Code exibido no terminal. O app descobre sozinho o IP do computador e usa a API na porta 3000 — não é preciso configurar nada.

| Plataforma | Como abrir |
| --- | --- |
| 🤖 Android | Expo Go → **"Scan QR code"**. Não precisa de conta. |
| 🍎 iPhone | Exige **a mesma conta Expo** (gratuita) no computador (`npx expo login`) e no Expo Go. Depois, leia o QR Code com o app **Câmera** e permita o acesso à **Rede Local**. |
| 🌐 Navegador | Pressione `w` no terminal do Expo (abre em `http://localhost:8081`). |

> Já tinha o projeto rodando antes? Rode `docker compose up -d --build` de novo para a API ganhar as rotas novas (alunos, professores, comentários, matérias). As tabelas novas são criadas automaticamente.

Passo a passo completo para Android e iPhone, arquitetura e guia de uso: **[`mobile/README.md`](mobile/README.md)**.

---

## 7. Rodar os testes automatizados

Na raiz do projeto:

```bash
npm install
npm test
```

**Não precisa de Docker nem de banco.** O resultado esperado (em poucos segundos):

```
PASS tests/middlewares.test.js
PASS tests/posts.test.js
PASS tests/comentarios.test.js
PASS tests/usuarios.test.js

Tests: 38 passed, 38 total
```

Outros comandos úteis:

| Comando | Para que serve |
| --- | --- |
| `npx jest tests/posts.test.js` | roda só um arquivo de teste |
| `npx jest -t "comentário sem nome"` | roda só os testes cujo nome contém o texto |
| `npx jest --watch` | roda de novo automaticamente a cada arquivo salvo |
| `npx jest --coverage` | mostra quanto do código os testes cobrem (gera a pasta `coverage/`) |

### Como os testes funcionam

Os testes usam **Jest** (roda os testes e faz as verificações com `expect`) e **Supertest** (faz requisições HTTP para a API sem subir o servidor).

A requisição passa de verdade pela **rota**, pelos **middlewares** (validações e token) e pelo **controller**. Só os **services**, que acessariam o banco, são substituídos por versões simuladas (*mocks*), que devolvem o que o teste definir. Exemplo (`tests/posts.test.js`):

```js
jest.mock('../src/services/postsService'); // troca o service por uma versão simulada

test('PUT /posts/:id de outro professor devolve 403', async () => {
  // o "banco" simulado diz que a aula é do professor 2
  postsService.findById.mockResolvedValue({ ...aula, idProfessor: 2 });

  // o professor 1 (token de teste) tenta editar
  const resposta = await request(app)
    .put('/posts/1')
    .set('Authorization', `Bearer ${tokenDeProfessor()}`)
    .send({ titulo: 'Novo', conteudo: 'Novo', idMateria: 1 });

  expect(resposta.status).toBe(403);                  // foi bloqueado
  expect(postsService.update).not.toHaveBeenCalled(); // e nada foi alterado
});
```

Arquivos de apoio:

- `tests/setup.js` — define um segredo de token usado só nos testes (não usa o `.env`);
- `tests/helpers.js` — gera o token de um professor de teste e cria `req`/`res` simulados para testar middlewares;
- `src/app.js` — monta a API sem conectar no banco; é ele que os testes importam.

### O que é testado

| Arquivo | O que testa |
| --- | --- |
| `tests/middlewares.test.js` | validações: aula sem matéria, ID inválido, comentário sem nome ou longo demais, e-mail inválido, senha obrigatória/curta, paginação |
| `tests/posts.test.js` | lista e busca públicas, aula inexistente (404), criar sem token (401), criar com token, editar aula de outro professor (403), excluir junto com os comentários |
| `tests/comentarios.test.js` | aluno comenta com nome, sem nome (400), aula inexistente (404), responder sem login (401), resposta única por comentário (409), comentário de outra aula (404) |
| `tests/usuarios.test.js` | login (400/401/200), cadastro de alunos sem senha, e-mail duplicado (409), paginação, professor sem senha (400), não excluir a si mesmo nem professor com postagens |

### O que não é coberto

- As consultas SQL dos services: como o banco é simulado, um erro dentro de uma query não é detectado pelos testes.
- O front-end web e o app mobile não têm testes automatizados; no CI eles passam pela checagem de tipos (TypeScript).

### Como criar um teste novo

1. Crie um arquivo terminado em `.test.js` dentro de `tests/` — o Jest encontra sozinho.
2. Use os arquivos existentes como modelo: `jest.mock(...)` para os services usados, `request(app)` para chamar a rota e `expect(...)` para conferir o resultado.
3. Rode `npm test` para ver o resultado.

---

## 8. Integração contínua (GitHub Actions)

O workflow `.github/workflows/Main.yml` roda a cada push e pull request na branch principal:

1. **Testes do backend** — `npm test`;
2. **Checagem de tipos** do front-end web e do app mobile (TypeScript);
3. **Imagens Docker** da API e do front-end — só são geradas se os passos anteriores passarem, e em push são publicadas no Docker Hub (`blog-educacional-backend` e `blog-educacional-frontend`).

---

# 🔗 Endpoints da API

## 🔐 Autenticação

Só **professores** fazem login. Ler aulas e comentar é público (é assim que os alunos usam o sistema). **Criar, atualizar e excluir aulas, responder comentários e toda a gestão de professores e alunos exigem o token de um professor** — sem ele a resposta é `401`.

| Método | Rota | Acesso |
| --- | --- | --- |
| `POST` | `/auth/login` | público |
| `GET` | `/auth/perfil` | **professor** |
| `GET` | `/posts`, `/posts/search`, `/posts/:id` | público |
| `GET` | `/materias` | público |
| `POST` `PUT` `DELETE` | `/posts`, `/posts/:id` | **professor** (editar/excluir só as próprias) |
| `GET` | `/posts/:id/comentarios` | público |
| `POST` | `/posts/:id/comentarios` | público (aluno informa o nome) |
| `POST` | `/posts/:id/comentarios/:idComentario/resposta` | **professor** |
| `GET` `POST` `PUT` `DELETE` | `/professores`, `/professores/:id` | **professor** |
| `GET` `POST` `PUT` `DELETE` | `/alunos`, `/alunos/:id` | **professor** |

### POST `/auth/login`

```json
{
  "email": "joao@blog.com",
  "senha": "joao123"
}
```

Resposta `200 OK`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "professor": {
    "idProfessor": 1,
    "nome": "Prof. João",
    "email": "joao@blog.com"
  }
}
```

Credencial inválida devolve `401`; campos faltando, `400`.

Nas rotas protegidas, envie o token no header:

```
Authorization: Bearer <token>
```

Sem o header, ou com token expirado, a resposta é `401 Unauthorized`.

---

## 👩‍🏫 Professores e 🎓 Alunos

As duas rotas têm o mesmo formato (troque `/professores` por `/alunos`). Todas exigem token de **professor**.

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/professores?pagina=1&limite=10` | listagem paginada (limite máx. 50) |
| `GET` | `/professores/:id` | busca por ID |
| `POST` | `/professores` | cadastra — body `{ "nome", "email", "senha" }` |
| `PUT` | `/professores/:id` | edita — `senha` é opcional (sem ela, mantém a atual) |
| `DELETE` | `/professores/:id` | exclui |

Para alunos o body é só `{ "nome", "email" }` — alunos não fazem login, então não têm senha.

Resposta da listagem:

```json
{
  "dados": [{ "idProfessor": 1, "nome": "Prof. João", "email": "joao@blog.com" }],
  "pagina": 1,
  "limite": 10,
  "total": 2,
  "totalPaginas": 1
}
```

Regras:

- O e-mail é único entre professores **e** alunos — duplicado devolve `409`.
- Senha do professor com no mínimo 6 caracteres; nunca é devolvida nas respostas.
- Um professor não pode excluir a própria conta (`400`) nem um professor que ainda tem postagens (`409`).

---

## 💬 Comentários

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/posts/:id/comentarios` | lista os comentários da aula, do mais antigo para o mais novo (público) |
| `POST` | `/posts/:id/comentarios` | o aluno comenta — body `{ "nome", "texto" }` (público) |
| `POST` | `/posts/:id/comentarios/:idComentario/resposta` | o professor responde — body `{ "texto" }` (exige token) |

Regras:

- O aluno comenta sem login, informando o nome (até 100 caracteres). O texto é obrigatório e tem no máximo 1000 caracteres.
- O professor não comenta direto na aula: ele **responde** ao comentário de um aluno. Cada comentário aceita **uma única resposta** — uma segunda devolve `409`.
- Aula ou comentário inexistente devolve `404`.

Exemplo de comentário já respondido:

```json
{
  "idComentario": 1,
  "idAula": 3,
  "nomeAluno": "Pedro",
  "texto": "Gostei da aula!",
  "dataComentario": "2026-10-22T21:07:25.020Z",
  "resposta": "Obrigado, Pedro!",
  "nomeProfessorResposta": "Prof. João",
  "dataResposta": "2026-10-22T21:15:02.110Z"
}
```

---

## 📖 Matérias

`GET /materias` — lista as matérias (`idMateria`, `nome`) para montar o seletor do formulário de postagem.

---

## 📚 Aulas

---

# Criar Aula

### POST

```
/posts
```

> Exige o header `Authorization: Bearer <token>`.

Exemplo:

```json
{
  "titulo": "Introdução ao Node.js",
  "conteudo": "Aprendendo criação de APIs REST",
  "idProfessor": 1,
  "idMateria": 1
}
```

Resposta:

```
201 Created
```

---

# Listar Aulas

### GET

```
/posts
```

Resposta:

```
200 OK
```

---

# Buscar Aula por ID

### GET

```
/posts/:id
```

Exemplo:

```
GET /posts/1
```

Resposta:

```
200 OK
```

---

# Pesquisar Aulas

### GET

```
/posts/search?q=node
```

Exemplo:

```
GET /posts/search?q=javascript
```

Realiza busca pelo título ou conteúdo.

---

# Atualizar Aula

### PUT

```
/posts/:id
```

> Exige o header `Authorization: Bearer <token>`.

Exemplo:

```
PUT /posts/1
```

Body:

```json
{
  "titulo": "Node.js Avançado",
  "conteudo": "Conteúdo atualizado",
  "idProfessor": 1,
  "idMateria": 2
}
```

Resposta:

```
200 OK
```

---

# Excluir Aula

### DELETE

```
/posts/:id
```

> Exige o header `Authorization: Bearer <token>`.

Exemplo:

```
DELETE /posts/1
```

Resposta:

```
204 No Content
```

---

# 🧪 Exemplos de Uso

## Criar uma aula pelo Postman

Primeiro obtenha o token em `POST /auth/login` (veja a seção de Autenticação) e copie o valor de `token`.

Método:

```
POST
```

URL:

```
http://localhost:3000/posts
```

Headers:

```
Content-Type: application/json
Authorization: Bearer <token>
```

Body:

```json
{
  "titulo": "Banco de Dados SQL Server",
  "conteudo": "Introdução ao SQL Server utilizando Docker",
  "idProfessor": 1,
  "idMateria": 1
}
```

Resultado esperado:

```
201 Created
```

---

## Atualizar uma aula

Método:

```
PUT
```

URL:

```
http://localhost:3000/posts/1
```

Resultado:

```
200 OK
```

---

## Remover uma aula

Método:

```
DELETE
```

URL:

```
http://localhost:3000/posts/1
```

Resultado:

```
204 No Content
```


# ✅ Status do Projeto

✔ API REST com CRUD de aulas, professores, alunos e comentários  
✔ Login de professores com JWT  
✔ Banco SQL Server, API e front-end em Docker  
✔ Front-end web (React) e app mobile (React Native / Expo)  
✔ Testes automatizados (Jest) e CI no GitHub Actions  
✔ Documentação criada

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos como parte do **Tech Challenge — Fase 4 — Pós-Graduação FIAP Full Stack Development**.

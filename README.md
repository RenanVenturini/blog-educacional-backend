# 📚 Blog Educacional - Backend

## Tech Challenge 2 - FIAP | Grupo 51

Projeto desenvolvido durante a Pós-Graduação FIAP em **Full Stack Development**.

O objetivo deste projeto é desenvolver uma API REST para gerenciamento de conteúdos educacionais, permitindo que professores publiquem aulas e alunos possam consultar os conteúdos disponibilizados.

A aplicação permite o cadastro, consulta, atualização, pesquisa e exclusão de aulas, organizando as informações por professor e matéria.

---

# 👥 Integrantes - Grupo 51

- Gabrielle Carvalho
- Renan Venturini
- Amanda Rodrigues
- Guilherme Lima
- Ana Caroliny

---

# 📝 Descrição do Projeto

O Blog Educacional é uma API backend responsável pelo gerenciamento de aulas e conteúdos educacionais.

A solução foi desenvolvida utilizando Node.js e Express.js, com persistência de dados em SQL Server, executado através de containers Docker.

O sistema permite que professores disponibilizem conteúdos educacionais para alunos através de aulas cadastradas.

## Funcionalidades

✅ Cadastro de aulas  
✅ Listagem de aulas  
✅ Busca de aulas por conteúdo  
✅ Consulta de aula por ID  
✅ Atualização de aulas  
✅ Exclusão de aulas

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
```

---

### Tabela Materia

```
Materia
--------------------------------
IdMateria
NomeMateria
```

---

## Relacionamentos

```
Professor
     |
     | 1:N
     |
   Aulas
     |
     | N:1
     |
  Materia
```

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

## Ferramentas

- Git
- GitHub
- Postman
- Visual Studio Code

---

# 📂 Estrutura do Projeto

```
blog-educacional-backend

├── src
│
├── controllers
│   └── postsController.js
│
├── middlewares
│   └── postMiddleware.js
│
├── models
│
├── routes
│   └── posts.routes.js
│
├── services
│   └── postsService.js
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── README.md
└── .env
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
| `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` | credenciais do SQL Server |
| `DB_SERVER` | `localhost` para rodar a API na máquina; o Compose usa `database` dentro do container |
| `JWT_SECRET` | **obrigatório** — segredo que assina os tokens de login; a API não sobe sem ele |
| `JWT_EXPIRES_IN` | validade do token (8h) |
| `SEED_PROFESSOR_EMAIL`, `SEED_PROFESSOR_SENHA` | credenciais do professor de teste criado no primeiro start |

Para um ambiente real, gere um segredo próprio:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

O banco (`BlogEducacional`), as tabelas e os dados de exemplo são criados automaticamente no primeiro start da API — não há script de migração para rodar à mão.

---

## 4. Subir o banco e a API

```bash
docker compose up -d --build
```

Esse comando sobe **os dois containers**: o SQL Server e a API. O container da API aguarda o banco ficar saudável antes de iniciar (leva cerca de 40 segundos no primeiro start, enquanto o SQL Server inicializa).

Verificar:

```bash
docker compose ps
```

Containers esperados:

```
blog-educacional-db    Up (healthy)
blog-educacional-api   Up
```

Acompanhar o log da API:

```bash
docker compose logs -f api
```

Deve aparecer `Conectado ao banco de dados SQL Server` e `Professor de teste disponivel: professor@blog.com`.

A API fica em **http://localhost:3000**.

> Não rode `npm run dev` junto com o container: a API já está de pé na porta 3000 e a segunda instância falha com `EADDRINUSE`.

---

## 5. Executar o front-end

O front-end React fica na pasta `frontend/`, em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

A interface abre em **http://localhost:5173** — a porta precisa ser essa, porque é a única origem liberada no CORS da API.

Credenciais do professor para acessar a área administrativa:

```
E-mail: professor@blog.com
Senha:  123456
```

A documentação técnica do front-end (arquitetura, rotas e guia de uso) está em **[`frontend/README.md`](frontend/README.md)**.

---

# 🔗 Endpoints da API

## 🔐 Autenticação

Leitura de aulas é pública. **Criar, atualizar e excluir exigem token** de professor.

| Método | Rota | Token |
| --- | --- | --- |
| `POST` | `/auth/login` | não |
| `GET` | `/auth/perfil` | sim |
| `GET` | `/posts`, `/posts/search`, `/posts/:id` | não |
| `POST` `PUT` `DELETE` | `/posts`, `/posts/:id` | **sim** |

### POST `/auth/login`

```json
{
  "email": "professor@blog.com",
  "senha": "123456"
}
```

Resposta `200 OK`:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "professor": {
    "idProfessor": 1,
    "nome": "Prof. João",
    "email": "professor@blog.com"
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

---

# 🎥 Vídeo de Apresentação

Vídeo de apresentação da solução desenvolvida pelo **Grupo 51**:

🔗 Link do vídeo:

```
Adicionar link da gravação aqui
```

No vídeo serão apresentados:

- Objetivo do projeto;
- Arquitetura da aplicação;
- Tecnologias utilizadas;
- Estrutura do backend;
- Configuração do banco de dados com Docker;
- Demonstração dos endpoints utilizando Postman.

---

# ✅ Status do Projeto

✔ API REST desenvolvida  
✔ CRUD de aulas implementado  
✔ Banco SQL Server configurado  
✔ Docker configurado  
✔ Endpoints testados no Postman  
✔ Documentação criada

---

# 📄 Licença

Projeto desenvolvido exclusivamente para fins acadêmicos como parte do **Tech Challenge 2 - Pós-Graduação FIAP Full Stack Development**.

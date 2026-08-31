# 📚 Blog Educacional — Front-end

## Tech Challenge 3 — FIAP | Grupo 20

## 📌 Sobre o projeto

O **Blog Educacional** é uma aplicação web desenvolvida em **React e TypeScript**, criada como parte do **Tech Challenge 3 da FIAP**.

O projeto tem como objetivo disponibilizar uma plataforma educacional para publicação e consulta de conteúdos, conectando uma interface moderna e responsiva a uma **API REST desenvolvida no back-end**.

A aplicação possui dois perfis de acesso:

- 🎓 **Aluno:** pode visualizar, pesquisar e ler as postagens publicadas, sem necessidade de cadastro ou login.
- 👨‍🏫 **Professor:** possui acesso autenticado ao painel administrativo, podendo criar, visualizar, editar e excluir postagens.

O front-end foi desenvolvido com foco em **organização de código, reutilização de componentes, responsividade, acessibilidade e integração com a API**.

---

## 🚀 Funcionalidades

### Área do Aluno

- Visualização das postagens publicadas
- Pesquisa de postagens
- Visualização de título, matéria, autor, data e resumo
- Leitura completa das postagens
- Interface responsiva
- Acesso sem necessidade de login

### Área do Professor

- Login com autenticação
- Painel administrativo
- Listagem de postagens
- Criação de novas postagens
- Edição de postagens existentes
- Exclusão de postagens
- Visualização individual das postagens
- Controle de sessão
- Proteção das rotas administrativas
- Logout

---

## 🛠️ Tecnologias

- **React 19**
- **TypeScript 6**
- **Vite 8**
- **React Router DOM 7**
- **Axios 1.19**
- **Oxlint**
- **CSS puro**
- **Context API**

A estilização utiliza **CSS puro**, com um arquivo de estilos específico para cada componente.

Não foram utilizadas bibliotecas externas de UI, ícones ou gerenciamento de estado.

---

## ⚙️ Setup inicial

### Pré-requisitos

Antes de executar o projeto, é necessário ter:

- **Node.js 20+**
- **npm**
- **Back-end do Blog Educacional em execução**

O back-end deve estar disponível em:

```text
http://localhost:3000
```

> Consulte o README da raiz do projeto para as instruções de configuração do back-end, banco de dados e Docker.

### Instalação

Na pasta raiz do projeto, execute:

```bash
cd frontend
npm install
npm run dev
```

Após iniciar o Vite, o front-end estará disponível em:

```text
http://localhost:5173
```

> ⚠️ **Importante:** a aplicação deve ser executada na porta `5173`, pois o back-end está configurado para permitir requisições CORS apenas dessa origem.

---

## 📋 Comandos disponíveis

| Comando           | Descrição                                    |
| ----------------- | -------------------------------------------- |
| `npm install`     | Instala as dependências do projeto           |
| `npm run dev`     | Inicia o servidor de desenvolvimento         |
| `npm run build`   | Verifica os tipos e gera o build de produção |
| `npm run preview` | Executa uma prévia do build de produção      |
| `npm run lint`    | Executa o Oxlint no código-fonte             |

---

## 🏗️ Arquitetura da aplicação

A aplicação foi organizada separando responsabilidades entre páginas, componentes, contexto de autenticação e serviços.

```text
Páginas (pages/)
       ↓
Componentes (components/)
       ↓
Serviços (services/)
       ↓
API REST (back-end)
```

### Principais responsabilidades

- **Pages:** controlam as telas, rotas, estados e efeitos da aplicação.
- **Components:** possuem elementos reutilizáveis da interface.
- **Services:** centralizam a comunicação com a API.
- **Contexts:** controlam o estado global da autenticação.
- **Types:** armazenam as interfaces e tipagens utilizadas pela aplicação.

Uma das principais regras da arquitetura é que os componentes **não realizam requisições diretamente com Axios**. Toda comunicação com a API passa pela camada de serviços.

---

## 📁 Estrutura de pastas

```text
src/
├── main.tsx
├── App.tsx
├── index.css
│
├── assets/
│   └── ilustrações e ícones SVG
│
├── pages/
│   ├── Landing/
│   ├── Home/
│   ├── Post/
│   ├── Login/
│   ├── Admin/
│   ├── CreatePost/
│   └── EditPost/
│
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── SearchBar/
│   ├── PostCard/
│   ├── FundoDecorativo/
│   ├── PainelLayout/
│   ├── PostForm/
│   └── RotaPrivada/
│
├── contexts/
│   ├── authContext.ts
│   └── AuthProvider.tsx
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── postsService.ts
│
└── types/
```

### Organização dos principais diretórios

**`pages/`**

Contém as páginas principais da aplicação e suas respectivas regras de funcionamento.

**`components/`**

Reúne componentes reutilizáveis, como cabeçalho, rodapé, cards de postagens, formulário e elementos de layout.

**`contexts/`**

Responsável pelo gerenciamento da sessão e autenticação do professor utilizando a Context API do React.

**`services/`**

Centraliza todas as requisições realizadas para o back-end.

**`types/`**

Contém as interfaces TypeScript utilizadas na aplicação.

---

## 🛣️ Rotas

As rotas são definidas em `src/App.tsx`.

| Rota                | Página     | Acesso       |
| ------------------- | ---------- | ------------ |
| `/`                 | Landing    | Público      |
| `/aluno`            | Home       | Público      |
| `/posts/:id`        | Post       | Público      |
| `/login`            | Login      | Público      |
| `/admin`            | Admin      | 🔒 Protegido |
| `/posts/novo`       | CreatePost | 🔒 Protegido |
| `/posts/:id/editar` | EditPost   | 🔒 Protegido |

As rotas administrativas são protegidas pelo componente `RotaPrivada`.

---

## 🔌 Integração com a API

A comunicação com o back-end é realizada utilizando **Axios**.

O arquivo:

```text
src/services/api.ts
```

contém a instância principal do Axios e configura o `baseURL` da API.

A aplicação utiliza um interceptor para adicionar automaticamente o token JWT nas requisições autenticadas.

```text
Authorization: Bearer <token>
```

### Posts

| Função                     | Método | Endpoint                |
| -------------------------- | ------ | ----------------------- |
| `listarPosts()`            | GET    | `/posts`                |
| `buscarPosts(termo)`       | GET    | `/posts/search?q=termo` |
| `buscarPostPorId(id)`      | GET    | `/posts/:id`            |
| `criarPost(dados)`         | POST   | `/posts`                |
| `atualizarPost(id, dados)` | PUT    | `/posts/:id`            |
| `excluirPost(id)`          | DELETE | `/posts/:id`            |

### Autenticação

| Função                | Método | Endpoint       |
| --------------------- | ------ | -------------- |
| `login(email, senha)` | POST   | `/auth/login`  |
| `buscarPerfil()`      | GET    | `/auth/perfil` |

A sessão é armazenada no `localStorage`.

---

## 🔐 Autenticação e autorização

O fluxo de autenticação funciona da seguinte maneira:

```text
1. Professor acessa /login
          ↓
2. Informa e-mail e senha
          ↓
3. Front-end envia POST /auth/login
          ↓
4. API retorna token + dados do professor
          ↓
5. Sessão é armazenada no localStorage
          ↓
6. Professor é direcionado para /admin
          ↓
7. Axios envia o token automaticamente
          ↓
8. RotaPrivada protege as páginas administrativas
```

Ao recarregar a aplicação, o `AuthProvider` valida a sessão através do endpoint:

```text
GET /auth/perfil
```

Caso o token seja inválido ou esteja expirado, a sessão é encerrada e o usuário precisa realizar o login novamente.

> A proteção realizada pelo front-end tem como objetivo controlar a experiência de navegação. A segurança das operações é garantida pelo back-end, que valida o JWT nas operações de criação, edição e exclusão.

---

## 🎨 Estilização e responsividade

A aplicação utiliza **CSS puro**, mantendo um arquivo de estilos separado para cada componente.

Exemplo:

```text
PostCard/
├── PostCard.tsx
└── PostCard.css
```

A interface foi desenvolvida para funcionar em diferentes tamanhos de tela, utilizando:

- `clamp()` para tamanhos de texto;
- CSS Grid;
- Flexbox;
- Media Queries;
- Breakpoints em `900px`, `640px` e `480px`;
- Layout responsivo para desktop, tablet e mobile.

### 🎨 Paleta principal

| Elemento         | Cor       |
| ---------------- | --------- |
| Azul principal   | `#2b8ae6` |
| Azul hover       | `#1b74c4` |
| Fundo            | `#eff1f4` |
| Forma clara      | `#c7ddf8` |
| Forma suave      | `#dcebfc` |
| Texto            | `#1f2937` |
| Texto secundário | `#64748b` |

---

## ♿ Acessibilidade

Foram aplicadas algumas práticas de acessibilidade durante o desenvolvimento:

- Uso de `<label>` associado aos campos através de `htmlFor`;
- Uso de `alt=""` para imagens decorativas;
- Uso de `aria-hidden` em elementos puramente visuais;
- Mensagens de carregamento e estado utilizando `role="status"`;
- Mensagens de erro utilizando `role="alert"`;
- Tamanho mínimo de `1rem` nos inputs para evitar zoom automático no iOS.

---

# 📖 Guia de uso

Com o back-end e o front-end em execução, acesse:

```text
http://localhost:5173
```

A tela inicial apresenta duas opções:

```text
Área do Aluno
Área do Professor
```

---

## 🎓 Fluxo do Aluno

O aluno não precisa realizar login.

### 1. Acessar a área do aluno

Clique em **Área do Aluno** para acessar:

```text
/aluno
```

Nessa tela são apresentadas as postagens disponíveis.

### 2. Pesquisar uma postagem

Utilize o campo de busca para localizar conteúdos.

A pesquisa considera informações como:

- título;
- conteúdo;
- nome do professor;
- matéria.

### 3. Ler uma postagem

Ao selecionar **Ler mais**, o usuário é direcionado para:

```text
/posts/:id
```

onde poderá visualizar o conteúdo completo da postagem.

---

## 👨‍🏫 Fluxo do Professor

O professor precisa realizar login para acessar as funcionalidades administrativas.

### Credenciais de teste

```text
Prof. João    joao@blog.com    joao123
Prof. Maria   maria@blog.com   maria123
```

### 1. Login

Acesse:

```text
/login
```

Informe as credenciais de teste para entrar no sistema.

### 2. Painel administrativo

Após o login, o professor é direcionado para:

```text
/admin
```

No painel é possível visualizar todas as postagens e realizar ações como:

- Visualizar;
- Editar;
- Excluir;
- Criar nova postagem.

### 3. Criar postagem

Acesse:

```text
/posts/novo
```

Preencha:

- Título;
- Autor;
- Matéria;
- Conteúdo.

Depois, clique em **Salvar**.

### 4. Editar postagem

Acesse a opção **Editar** em uma postagem existente.

A aplicação abre o formulário preenchido com os dados atuais.

Após realizar as alterações, clique em:

**Salvar alterações**

### 5. Excluir postagem

Ao selecionar **Excluir**, a aplicação solicita uma confirmação antes de remover a postagem.

### 6. Logout

O botão **Sair** encerra a sessão e remove os dados de autenticação armazenados no navegador.

---

## 🔒 Rotas protegidas

Caso um usuário tente acessar diretamente uma rota administrativa sem estar autenticado, como:

```text
/admin
/posts/novo
/posts/:id/editar
```

será exibida a mensagem:

> **Acesso negado — Faça login para continuar**

Usuários que já estiverem autenticados e tentarem acessar `/login` serão direcionados automaticamente para o painel administrativo.

---

## 🔗 Back-end

O front-end depende da API REST desenvolvida no projeto do back-end.

O setup do:

- servidor;
- banco de dados SQL Server;
- Docker;
- Docker Compose;
- API REST;

está documentado no README da raiz do repositório.

[📖 README do Back-end](../README.md)

---

## 👩‍💻 Desenvolvimento

Projeto desenvolvido como parte do **Tech Challenge 3 — FIAP**, com foco na construção de uma aplicação web educacional integrada a uma API REST.

**Grupo 20 — FIAP**

- Gabrielle Carvalho
- Renan Venturini
- Amanda Rodrigues

# Blog Educacional — Front-end

Interface web do Blog Educacional, construída em React, que consome a API REST do back-end deste repositório. Atende dois perfis:

- **Aluno** — navega e pesquisa as postagens publicadas, sem cadastro.
- **Professor** — autentica-se e gerencia as postagens (criar, editar e excluir).

## Tecnologias

React 19 · TypeScript 6 · Vite 8 · React Router DOM 7 · Axios 1.19 · Oxlint

A estilização usa CSS puro, um arquivo por componente. O estado de sessão usa a Context API do próprio React. Nenhuma biblioteca de UI, ícones ou gerenciamento de estado foi adicionada.

---

## Setup inicial

**Pré-requisitos:** Node.js 20+ e o **back-end em execução** em `http://localhost:3000` (veja o README da raiz). Sem a API no ar as telas abrem, mas exibem aviso de falha de conexão.

```bash
cd frontend
npm install
npm run dev
```

> A porta 5173 não é opcional: o back-end libera CORS apenas para `http://localhost:5173`. Se o Vite subir em outra porta, o navegador bloqueia as requisições.

Outros comandos:

| Comando | O que faz |
| --- | --- |
| `npm run build` | checa tipos (`tsc -b`) e gera o build em `dist/` |
| `npm run preview` | serve o build de produção |
| `npm run lint` | executa o Oxlint sobre `src/` |

A URL da API fica em `src/services/api.ts` (`baseURL`). Para apontar para outro host, altere ali e ajuste o `cors` do back-end em `index.js`.

---

## Arquitetura da aplicação

```
Páginas (pages/)          rotas completas, controlam estado e efeitos
      |
Componentes (components/) pedaços reutilizáveis de interface
      |
Serviços (services/)      única camada que conversa com a API
      |
API REST (back-end)
```

Duas regras sustentam a divisão: **nenhum componente chama `axios` diretamente** (toda requisição passa por `services/`, que centraliza a URL base e o envio do token) e **o estado de sessão vive no contexto**, acessado por qualquer tela com o hook `useAuth()`.

### Estrutura de pastas

```
src/
├── main.tsx                ponto de entrada; envolve o App no AuthProvider
├── App.tsx                 definição das rotas
├── index.css               reset, tipografia base e layout de rodapé fixo
│
├── assets/                 ilustração da tela inicial e ícones SVG
│
├── pages/                  Landing, Home, Post, Login, Admin, CreatePost, EditPost
│
├── components/
│   ├── Header/ Footer/     cabeçalho e rodapé das telas públicas
│   ├── SearchBar/          campo de busca controlado
│   ├── PostCard/           cartão de postagem na listagem
│   ├── FundoDecorativo/    formas SVG de fundo
│   ├── PainelLayout/       moldura das telas do professor
│   ├── PostForm/           formulário compartilhado por criar e editar
│   └── RotaPrivada/        guarda de rota e tela de acesso negado
│
├── contexts/
│   ├── authContext.ts      contexto e hook useAuth()
│   └── AuthProvider.tsx    estado da sessão e validação do token
│
├── services/
│   ├── api.ts              instância do axios e interceptor do token
│   ├── authService.ts      login, sessão no localStorage e perfil
│   └── postsService.ts     CRUD de postagens
│
└── types/                  interfaces Post, Professor e RespostaLogin
```

Dois pontos da organização que não são óbvios: `PostForm` e `PainelLayout` existem porque as telas de criar e editar compartilham o mesmo formulário e a mesma moldura; e `authContext.ts` está separado de `AuthProvider.tsx` porque o Fast Refresh do Vite exige que um arquivo exporte apenas componentes, então o hook fica em um módulo `.ts` e o provider em um `.tsx`.

### Rotas

Definidas em `src/App.tsx`. As protegidas são envolvidas pelo componente `RotaPrivada`.

| Rota | Página | Acesso |
| --- | --- | --- |
| `/` | `Landing` | público |
| `/aluno` | `Home` | público |
| `/posts/:id` | `Post` | público |
| `/login` | `Login` | público |
| `/admin` | `Admin` | **protegido** |
| `/posts/novo` | `CreatePost` | **protegido** |
| `/posts/:id/editar` | `EditPost` | **protegido** |

### Camada de serviços

`api.ts` cria a instância do axios e registra um interceptor que anexa `Authorization: Bearer <token>` em toda requisição, quando há token salvo — por isso nenhuma tela monta esse header manualmente.

| `postsService.ts` | Requisição |
| --- | --- |
| `listarPosts()` | `GET /posts` |
| `buscarPosts(termo)` | `GET /posts/search?q=termo` |
| `buscarPostPorId(id)` | `GET /posts/:id` |
| `criarPost(dados)` | `POST /posts` |
| `atualizarPost(id, dados)` | `PUT /posts/:id` |
| `excluirPost(id)` | `DELETE /posts/:id` |

| `authService.ts` | O que faz |
| --- | --- |
| `login(email, senha)` | `POST /auth/login`, devolve `{ token, professor }` |
| `salvarSessao` / `limparSessao` | grava e remove a sessão no `localStorage` |
| `obterToken` / `obterProfessor` | leem o `localStorage` |
| `buscarPerfil()` | `GET /auth/perfil`, valida o token atual |

Os três verbos de escrita (`POST`, `PUT`, `DELETE`) exigem token; todos os `GET` de postagens são públicos.

### Autenticação e autorização

```
1. Login       Login.tsx chama entrar() do contexto -> POST /auth/login
               -> { token, professor } salvos no localStorage -> vai para /admin
2. Requisições o interceptor do axios injeta o Bearer token em toda chamada
3. Recarga     ao montar, o AuthProvider chama GET /auth/perfil; se falhar,
               limpa a sessão (evita interface "logada" com token morto)
4. Proteção    RotaPrivada consulta useAuth(): sem sessão, renderiza
               "Acesso negado / Faça login para continuar"
5. Expiração   o token vale 8 horas; expirado, as telas avisam e pedem novo login
6. Logout      o botão "Sair" limpa o localStorage e volta ao login
```

Qualquer componente consome a sessão com `const { professor, autenticado, carregando, entrar, sair } = useAuth()`.

> A proteção do front é de experiência de uso, não de segurança. Quem impede a escrita sem token é o back-end, que valida o JWT em `POST`, `PUT` e `DELETE /posts`.

### Estilização e responsividade

- Um arquivo CSS por componente, importado por ele (`import "./PostCard.css"`), com classes no padrão `bloco__elemento--modificador`.
- Rodapé sempre no fim da página: `#root` é flex em coluna com `min-height: 100vh`, o conteúdo recebe `flex: 1` e o `.footer` usa `margin-top: auto`.
- Paleta: azul de ação `#2b8ae6`, hover `#1b74c4`, fundo `#eff1f4`, formas `#c7ddf8` e `#dcebfc`, texto `#1f2937` e texto suave `#64748b`.
- Títulos com `clamp()` e listagem em `repeat(auto-fill, minmax(300px, 1fr))` — escalam sem media query. Breakpoints em 900px, 640px e 480px para os ajustes de layout.
- Acessibilidade: `<label>` associado por `htmlFor` em todo campo, ícones decorativos com `alt=""` e `aria-hidden`, mensagens de estado com `role="status"` ou `role="alert"`, inputs em `font-size: 1rem` para evitar o zoom do iOS.

---

## Guia de uso

Com back-end e front-end em execução, abra **http://localhost:5173**. A tela inicial oferece dois caminhos: **Área do Aluno** e **Área do Professor**.

### Fluxo do aluno

Não exige login.

1. Clique em **Área do Aluno** (`/aluno`) para ver todas as postagens em cartões com matéria, título, autor, data e resumo.
2. Use o campo de busca para filtrar — o termo é procurado no título, no conteúdo, no nome do professor e no nome da matéria. Apagar o campo recarrega a lista completa.
3. **Ler mais** abre a postagem inteira (`/posts/:id`), com as quebras de linha preservadas.

A listagem distingue os casos: carregando, falha de conexão, nenhuma postagem publicada e busca sem resultado.

### Fluxo do professor

Exige login. Credenciais de teste criadas pelo back-end no primeiro start:

```
E-mail: professor@blog.com
Senha:  123456
```

1. Clique em **Área do Professor** (`/login`) e informe e-mail e senha.
2. Autenticado, você cai no **Painel do Professor** (`/admin`), com todas as postagens e os botões **Ver**, **Editar** e **Excluir** em cada linha.
3. **+ Nova postagem** (`/posts/novo`): preencha título, autor, matéria e conteúdo e clique em **Salvar**. Os campos são limpos para a próxima.
4. **Editar** (`/posts/:id/editar`) abre o formulário já preenchido com os dados atuais; ajuste e clique em **Salvar alterações**.
5. **Excluir** pede confirmação na própria linha — *Excluir? Confirmar / Cancelar*.
6. **Sair**, no topo do cartão, encerra a sessão.

Abrir `/admin`, `/posts/novo` ou `/posts/:id/editar` sem sessão válida exibe **"Acesso negado — Faça login para continuar"** com um botão para o login. Quem já está autenticado e acessa `/login` vai direto ao painel.

---

O setup do servidor, do banco SQL Server e dos containers está no [README da raiz do repositório](../README.md).

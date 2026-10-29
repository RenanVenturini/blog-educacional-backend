# 📱 Blog Educacional — App Mobile

## Tech Challenge — Fase 4 | FIAP | Grupo 4

Aplicativo mobile do Blog Educacional, desenvolvido em **React Native com Expo**. Ele consome a mesma API REST usada pelo front-end web (raiz deste repositório) e tem duas áreas:

- **Área do Aluno** (sem login) — lê e pesquisa as postagens e comenta informando o nome;
- **Área do Professor** (com login) — cria, edita e exclui as próprias postagens, responde aos comentários dos alunos e gerencia professores e alunos.

---

# 🧰 Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React Native 0.88 + Expo SDK 58 | base do app (componentes funcionais e hooks) |
| TypeScript | tipagem de todo o código |
| Expo Router | navegação por arquivos (pilha + abas) e rotas protegidas |
| Context API | estado global de autenticação (`AuthContext`) |
| Axios | chamadas à API REST (o token vai no header `Authorization`) |
| expo-secure-store | guarda o token com segurança no celular (Keychain / Keystore) |
| @expo/vector-icons | ícones (Ionicons) |

**Por que Expo?** O desafio pede React Native; o Expo é o framework recomendado pela própria documentação do React Native para novos projetos. Com ele o app roda no celular pelo **Expo Go** lendo um QR Code, sem precisar instalar Android Studio ou Xcode — o que facilita o desenvolvimento em grupo, a avaliação e a gravação da demonstração.

---

# ✅ Requisitos do desafio

| # | Requisito | Onde está |
| --- | --- | --- |
| 1 | Lista de posts com título, autor, descrição e busca | `src/app/aluno.tsx` (Área do Aluno) e aba **Postagens** — `src/components/ListaPostagens.tsx` |
| 2 | Leitura do post completo + comentários (opcional) | `src/app/posts/[id]/index.tsx` + `src/components/Comentarios.tsx` |
| 3 | Criação de postagens (título, conteúdo, autor) | `src/app/posts/novo.tsx` |
| 4 | Edição de postagens com dados atuais carregados | `src/app/posts/[id]/editar.tsx` |
| 5 | Cadastro de professores | `src/app/professores/novo.tsx` |
| 6 | Edição de professores | `src/app/professores/[id].tsx` |
| 7 | Listagem paginada de professores com editar/excluir | aba **Professores** — `src/components/UsuariosLista.tsx` |
| 8 | Requisitos 5, 6 e 7 para alunos | `src/app/alunos/novo.tsx`, `src/app/alunos/[id].tsx` e aba **Alunos** |
| 9 | Página administrativa de postagens com editar/excluir | aba **Painel** — `src/app/(tabs)/admin.tsx` |
| 10 | Login de professores e acesso restrito às páginas de criação/edição/administração | `src/app/login.tsx` + `Stack.Protected` em `src/app/_layout.tsx` |

Sobre a permissão de alunos ("alunos podem apenas visualizar"): o aluno usa o app **sem login** e só tem acesso à leitura. Mesmo que alguém tente alterar dados direto na API, ela recusa (`401`) qualquer criação, edição ou exclusão sem o token de um professor.

---

# ⚙️ Setup

## Pré-requisitos

- **Node.js 22 LTS** e **Docker Desktop** no computador
- Celular **Android** ou **iPhone** com o app **Expo Go** ([Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) / [App Store](https://apps.apple.com/app/expo-go/id982107779))
- Celular e computador **na mesma rede Wi-Fi**, marcada como **rede privada** no Windows (Configurações → Rede e Internet → Wi-Fi → propriedades da rede)

> O projeto usa o **Expo SDK 58**, a versão do Expo Go atual nas lojas. Se o Expo Go mostrar "Project is incompatible with this version of Expo Go", atualize o Expo Go pela loja.

## Passo 1 — Subir o banco e a API

Com o Docker Desktop aberto, na **raiz** do repositório:

```bash
docker compose up -d --build
docker compose ps
```

Aguarde `blog-educacional-db` aparecer como `healthy` e `blog-educacional-api` como `Up` (cerca de 40 segundos no primeiro start). O mesmo comando também sobe o front-end web em `http://localhost:5173`. Nos dias seguintes basta `docker compose up -d` — o `--build` só é necessário quando o código muda.

## Passo 2 — Iniciar o app

Em outro terminal:

```bash
cd mobile
npm install
npm start
```

O `npm install` só é necessário na primeira vez (ou quando o `package.json` mudar). O terminal mostra um **QR Code** e o endereço `exp://<ip-do-computador>:8081`.

Depois de atualizar o código (ex.: `git pull`), inicie com o cache limpo para o app carregar a versão nova:

```bash
npx expo start --clear
```

## Passo 3 — Abrir no celular

### 🤖 Android

1. Instale o **Expo Go** pela Play Store.
2. Abra o Expo Go e toque em **"Scan QR code"**.
3. Aponte para o QR Code do terminal.
4. Aguarde o carregamento (a primeira abertura leva alguns segundos) — aparece a tela inicial do Blog Educacional.

No Android não é preciso criar conta na Expo.

### 🍎 iPhone

No iPhone físico, o Expo Go exige que **o celular e o computador estejam logados na mesma conta Expo** ([detalhes](https://docs.expo.dev/troubleshooting/expo-go-sign-in-required/)). A conta é gratuita e só precisa ser configurada uma vez.

1. Crie uma conta em [expo.dev/signup](https://expo.dev/signup) (se ainda não tiver).
2. No **computador**, faça login no Expo CLI com essa conta (antes do `npm start`):
   ```bash
   npx expo login
   ```
   Para conferir a conta logada: `npx expo whoami`.
3. Instale o **Expo Go** pela App Store, abra o app, toque no **ícone de perfil** (canto superior direito) e entre com **a mesma conta**.
4. Rode `npm start` e aponte o app **Câmera** do iPhone para o QR Code — o Expo Go não tem leitor de QR no iOS. Toque no aviso **"Abrir no Expo Go"**.
5. Na primeira abertura, o iOS pergunta se o Expo Go pode acessar a **Rede Local**: toque em **Permitir**. (Se negou, ative em Ajustes → Privacidade e Segurança → Rede Local → Expo Go.)
6. Aparece a tela inicial do Blog Educacional.

Cada integrante usa a própria conta Expo no próprio computador e celular. Para trocar de conta no computador: `npx expo logout` e `npx expo login`.

### 🌐 Navegador (opcional)

Com o `npm start` rodando, pressione `w` no terminal — o app abre em `http://localhost:8081`. Útil para testar rápido sem celular.

## Endereço da API

Não é preciso configurar nada no caso comum. O app descobre a URL da API assim (`src/config.ts`):

1. `EXPO_PUBLIC_API_URL`, se definida em `mobile/.env.local`;
2. senão, o **IP do computador que roda o `npm start`**, na porta `3000` — é assim que o celular com Expo Go encontra a API;
3. senão, `http://localhost:3000` (navegador no próprio computador).

O endereço em uso aparece no rodapé da aba **Conta**. Para forçar outro endereço:

```bash
cp .env.example .env.local
# edite EXPO_PUBLIC_API_URL e recarregue o app
```

## Professores de teste

Criados automaticamente pela API (alunos não fazem login):

| Nome | E-mail | Senha |
| --- | --- | --- |
| Prof. João | joao@blog.com | joao123 |
| Prof. Maria | maria@blog.com | maria123 |

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm start` | inicia o servidor do Expo (QR Code) |
| `npm run android` / `npm run ios` / `npm run web` | abre direto na plataforma |
| `npm run typecheck` | checagem de tipos do TypeScript |

---

# 🏗️ Arquitetura

## Estrutura de pastas

```
mobile/
├── app.json                  configuração do Expo (nome, ícones, plugins)
├── .env.example              modelo da variável EXPO_PUBLIC_API_URL
└── src/
    ├── app/                  TELAS — cada arquivo é uma rota (Expo Router)
    │   ├── _layout.tsx       pilha raiz + quais telas podem ser abertas com/sem login
    │   ├── inicio.tsx        tela inicial: Área do Aluno / Área do Professor
    │   ├── aluno.tsx         Área do Aluno: lista de postagens (sem login)
    │   ├── login.tsx         login do professor
    │   ├── (tabs)/           abas da Área do Professor
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx     Postagens (lista + busca)
    │   │   ├── admin.tsx     Painel
    │   │   ├── professores.tsx
    │   │   ├── alunos.tsx
    │   │   └── conta.tsx
    │   ├── posts/
    │   │   ├── novo.tsx
    │   │   └── [id]/
    │   │       ├── index.tsx leitura + comentários
    │   │       └── editar.tsx
    │   ├── professores/
    │   │   ├── novo.tsx      cadastro
    │   │   └── [id].tsx      edição
    │   └── alunos/
    │       ├── novo.tsx
    │       └── [id].tsx
    ├── components/           componentes reutilizáveis (Botao, Campo, ListaPostagens, PostCard,
    │                         PostForm, UsuarioForm, UsuariosLista, Comentarios, Estados...)
    ├── contexts/
    │   └── AuthContext.tsx   login do professor (Context API)
    ├── services/             comunicação com a API
    │   ├── api.ts            instância do Axios + mensagens de erro
    │   ├── authService.ts    login, perfil e sessão salva no celular
    │   ├── postsService.ts   postagens, matérias e comentários
    │   ├── usuariosService.ts professores e alunos
    │   └── storage.ts        SecureStore no celular / localStorage na web
    ├── types/                interfaces TypeScript (Post, Comentario, Usuario...)
    ├── utils/                confirmação de exclusão e formatação de datas
    ├── config.ts             descoberta da URL da API
    └── theme.ts              cores e espaçamentos (mesma paleta do front web)
```

A pasta `src/app/` contém **apenas telas**; o que é reaproveitado fica em `components/`, `services/` e `contexts/`. Por exemplo, a lista de postagens (`ListaPostagens`) é a mesma na Área do Aluno e na aba do professor, e as telas de professores e de alunos usam o mesmo formulário (`UsuarioForm`) e a mesma lista paginada (`UsuariosLista`).

## Navegação

```
Stack (raiz)
├── inicio                        ← sem login
├── aluno                         ← sem login (Área do Aluno)
├── login                         ← sem login (Área do Professor)
├── (tabs)                        ← professor logado
│   ├── Postagens
│   ├── Painel
│   ├── Professores
│   ├── Alunos
│   └── Conta
├── posts/novo                    ← professor logado
├── posts/[id]/editar             ← professor logado
├── professores/novo, [id]        ← professor logado
├── alunos/novo, [id]             ← professor logado
└── posts/[id]                    ← todos (leitura + comentários)
```

O acesso é controlado com `Stack.Protected` do Expo Router: cada grupo de telas tem um `guard` (`logado` ou `!logado`). Quando o professor entra ou sai, os guards mudam e o app abre a primeira tela liberada da lista — por isso a ordem das telas no `_layout.tsx` importa.

## Autenticação e permissões

1. **Tela inicial** — **Área do Aluno** abre direto a lista de postagens, sem login. **Área do Professor** abre o login.
2. **Login** — `POST /auth/login` (só professores); a resposta traz o `token` e os dados do `professor`.
3. **Sessão** — o `AuthContext` salva token e professor no `SecureStore` e coloca o token no header do Axios. Ao reabrir o app, a sessão é restaurada e validada em `GET /auth/perfil`.
4. **Permissões** — o app esconde o que não pode ser usado, mas **quem garante a regra é a API**: sem token de professor ela recusa (`401`) criar, editar e excluir, e um professor só pode editar/excluir as próprias postagens. Por isso o Painel mostra todas as postagens, mas só oferece Editar/Excluir nas do professor logado.

## Estado e dados

- **Estado global:** apenas o login (`AuthContext`). O restante é estado local de cada tela (`useState`).
- **Atualização:** as listas recarregam ao voltar para a tela (`useFocusEffect`) e com "puxar para atualizar".
- **Busca:** digite e toque em **Buscar** (ou Enter no teclado) — consulta `GET /posts/search?q=`.
- **Paginação:** `GET /professores?pagina=N&limite=10` devolve `{ dados, pagina, total, totalPaginas }`, e a lista mostra "Página X de Y" com Anterior/Próxima.
- **Comentários:** carregados com a postagem. O aluno comenta informando o nome; o professor responde pelo botão **Responder** de cada comentário (uma resposta por comentário).

## Endpoints utilizados

| Tela | Endpoints |
| --- | --- |
| Login / sessão | `POST /auth/login`, `GET /auth/perfil` |
| Postagens / leitura | `GET /posts`, `GET /posts/search?q=`, `GET /posts/:id` |
| Comentários | `GET /posts/:id/comentarios`, `POST /posts/:id/comentarios`, `POST /posts/:id/comentarios/:idComentario/resposta` |
| Criar / editar / excluir post | `GET /materias`, `POST /posts`, `PUT /posts/:id`, `DELETE /posts/:id` |
| Professores | `GET/POST /professores`, `GET/PUT/DELETE /professores/:id` |
| Alunos | `GET/POST /alunos`, `GET/PUT/DELETE /alunos/:id` |

---

# 📖 Guia de uso

## Aluno
1. Na tela inicial, toque em **Área do Aluno** — a lista de postagens abre direto, sem login.
2. Role a lista ou pesquise (título, conteúdo, professor ou matéria) e toque em **Buscar**.
3. Toque numa postagem para ler o conteúdo completo e os comentários.
4. **Comentar:** no fim da postagem, preencha **Seu nome** e o **Comentário** e toque em **Comentar**.
5. **Início**, no topo da tela, volta para a tela inicial.

## Professor
1. Na tela inicial, toque em **Área do Professor** e entre com e-mail e senha (ex.: `joao@blog.com` / `joao123`).
2. **Criar postagem:** aba **Painel → Nova postagem**, preencha título, matéria e conteúdo e toque em **Publicar**. O autor é você (definido pela API).
3. **Editar/Excluir postagem:** no **Painel** (ou na tela de leitura de uma postagem sua), use **Editar** ou **Excluir**.
4. **Responder comentário:** na postagem, toque em **Responder** no comentário do aluno, escreva e toque em **Enviar resposta**. Cada comentário aceita uma resposta.
5. **Professores / Alunos:** nas abas correspondentes:
   - **Cadastrar** abre o formulário — professor: nome, e-mail e senha (mínimo de 6 caracteres); aluno: nome e e-mail;
   - **Editar** carrega os dados atuais — no professor, deixe a senha em branco para manter a atual;
   - **Excluir** pede confirmação;
   - use **Anterior/Próxima** para navegar entre as páginas.

Regras da API exibidas como mensagem no app: e-mail já cadastrado (professor ou aluno), professor não pode excluir a própria conta, e professor com postagens não pode ser excluído.

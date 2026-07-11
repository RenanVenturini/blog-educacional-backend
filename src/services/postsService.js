let posts = [];
let nextId = 1;

const postsService = {
  create(post) {
    const novoPost = {
      id: nextId++,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: new Date()
    };

    posts.push(novoPost);

    return novoPost;
  },

  findAll() {
    return posts;
  },

  findById(id) {
    return posts.find(post => post.id === id);
  },

  update(id, dadosAtualizados) {
    const post = posts.find(post => post.id === id);

    if (!post) {
      return null;
    }

    post.titulo = dadosAtualizados.titulo;
    post.conteudo = dadosAtualizados.conteudo;
    post.autor = dadosAtualizados.autor;
    post.dataAtualizacao = new Date();

    return post;
  },

  delete(id) {
    const index = posts.findIndex(post => post.id === id);

    if (index === -1) {
      return false;
    }

    posts.splice(index, 1);

    return true;
  },

  search(termo) {
    if (!termo) {
      return posts;
    }

    const termoMinusculo = termo.toLowerCase();

    return posts.filter(post =>
      post.titulo.toLowerCase().includes(termoMinusculo) ||
      post.conteudo.toLowerCase().includes(termoMinusculo)
    );
  },
};

module.exports = postsService;
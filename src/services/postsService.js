let aulas = [];
let nextId = 1;

const postsService = {
  create(aula) {
    const novaAula = {
      idAula: nextId++,
      titulo: aula.titulo,
      conteudo: aula.conteudo,
      idProfessor: aula.idProfessor,
      idMateria: aula.idMateria,
      dataPublicacao: new Date(),
    };

    aulas.push(novaAula);

    return novaAula;
  },

  findAll() {
    return aulas;
  },

  findById(id) {
    return aulas.find((aula) => aula.idAula === id);
  },

  update(id, dadosAtualizados) {
    const aula = aulas.find((aula) => aula.idAula === id);

    if (!aula) {
      return null;
    }

    aula.titulo = dadosAtualizados.titulo;
    aula.conteudo = dadosAtualizados.conteudo;
    aula.idProfessor = dadosAtualizados.idProfessor;
    aula.idMateria = dadosAtualizados.idMateria;

    return aula;
  },

  delete(id) {
    const index = aulas.findIndex((aula) => aula.idAula === id);

    if (index === -1) {
      return false;
    }

    aulas.splice(index, 1);

    return true;
  },

  search(termo) {
    if (!termo) {
      return aulas;
    }

    const termoMinusculo = termo.toLowerCase();

    return aulas.filter(
      (aula) =>
        aula.titulo.toLowerCase().includes(termoMinusculo) ||
        aula.conteudo.toLowerCase().includes(termoMinusculo),
    );
  },
};

module.exports = postsService;

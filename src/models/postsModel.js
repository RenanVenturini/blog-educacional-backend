// Modelo de dados da Aula
// Responsável: AMANDA (Banco e Modelagem)

const Aula = {
  idAula: Number,
  titulo: String,
  conteudo: String,
  idProfessor: Number,
  idMateria: Number,
  dataPublicacao: Date
};

module.exports = Aula;
const Professor = {
  idProfessor: Number,
  nome: String
};

module.exports = Professor;
 const Materia = {
  idMateria: Number,
  nome: String
};

module.exports = Materia;

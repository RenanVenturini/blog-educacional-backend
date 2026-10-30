// Modelos de dados do blog (documentam as colunas das tabelas criadas em index.js)
// Responsável: AMANDA (Banco e Modelagem)

const Aula = {
  idAula: Number,
  titulo: String,
  conteudo: String,
  idProfessor: Number,
  idMateria: Number,
  dataPublicacao: Date
};

const Professor = {
  idProfessor: Number,
  nome: String,
  email: String,
  senha: String
};

const Aluno = {
  idAluno: Number,
  nome: String,
  email: String
};

const Materia = {
  idMateria: Number,
  nome: String
};

// Comentário do aluno + resposta do professor (opcional, só uma por comentário)
const Comentario = {
  idComentario: Number,
  idAula: Number,
  nomeAluno: String,
  texto: String,
  dataComentario: Date,
  resposta: String,
  nomeProfessorResposta: String,
  dataResposta: Date
};

module.exports = { Aula, Professor, Aluno, Materia, Comentario };

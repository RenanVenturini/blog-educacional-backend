export interface Post {
  idAula: number;
  titulo: string;
  conteudo: string;
  idProfessor: number;
  idMateria: number;
  nomeProfessor: string;
  nomeMateria: string;
  dataPublicacao: string;
}

// Dados enviados para criar ou editar uma postagem
export interface DadosPost {
  titulo: string;
  conteudo: string;
  idMateria: number;
}

export interface Materia {
  idMateria: number;
  nome: string;
}

// Comentário do aluno + resposta do professor (null enquanto não for respondido)
export interface Comentario {
  idComentario: number;
  idAula: number;
  nomeAluno: string;
  texto: string;
  dataComentario: string;
  resposta: string | null;
  nomeProfessorResposta: string | null;
  dataResposta: string | null;
}

// Professor que fez login (só professores fazem login)
export interface Professor {
  idProfessor: number;
  nome: string;
  email: string;
}

// Professor ou aluno nas telas administrativas
export interface Usuario {
  idProfessor?: number;
  idAluno?: number;
  nome: string;
  email: string;
}

// Dados enviados para cadastrar ou editar professor/aluno
// (a senha é só de professores, porque alunos não fazem login)
export interface DadosUsuario {
  nome: string;
  email: string;
  senha?: string;
}

// Resposta da listagem paginada de professores/alunos
export interface ListaDeUsuarios {
  dados: Usuario[];
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

// Rota da API usada nas telas administrativas
export type TipoUsuario = 'professores' | 'alunos';

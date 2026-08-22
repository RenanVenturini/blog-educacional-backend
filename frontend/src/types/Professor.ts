export interface Professor {
  idProfessor: number;
  nome: string;
  email: string;
}

export interface RespostaLogin {
  token: string;
  professor: Professor;
}

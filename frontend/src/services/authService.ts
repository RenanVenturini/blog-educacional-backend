import api, { CHAVE_TOKEN } from "./api";
import type { Professor, RespostaLogin } from "../types/Professor";

const CHAVE_PROFESSOR = "blog-educacional:professor";

export async function login(
  email: string,
  senha: string
): Promise<RespostaLogin> {
  const response = await api.post<RespostaLogin>("/auth/login", {
    email,
    senha,
  });

  return response.data;
}

export function salvarSessao(dados: RespostaLogin) {
  localStorage.setItem(CHAVE_TOKEN, dados.token);
  localStorage.setItem(CHAVE_PROFESSOR, JSON.stringify(dados.professor));
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_PROFESSOR);
}

export function obterToken(): string | null {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function obterProfessor(): Professor | null {
  const salvo = localStorage.getItem(CHAVE_PROFESSOR);

  if (!salvo) {
    return null;
  }

  try {
    return JSON.parse(salvo) as Professor;
  } catch {
    limparSessao();
    return null;
  }
}

export async function buscarPerfil(): Promise<Professor> {
  const response = await api.get<{ professor: Professor }>("/auth/perfil");

  return response.data.professor;
}

import api from './api';
import { lerItem, removerItem, salvarItem } from './storage';

import type { Professor } from '../types';

const CHAVE_TOKEN = 'blog-educacional.token';
const CHAVE_PROFESSOR = 'blog-educacional.professor';

export async function login(email: string, senha: string) {
  const response = await api.post('/auth/login', { email, senha });

  return response.data as { token: string; professor: Professor };
}

export async function buscarPerfil() {
  const response = await api.get('/auth/perfil');

  return response.data.professor as Professor;
}

// Guarda o login no celular para não precisar entrar de novo ao reabrir o app
export async function salvarSessao(token: string, professor: Professor) {
  await salvarItem(CHAVE_TOKEN, token);
  await salvarItem(CHAVE_PROFESSOR, JSON.stringify(professor));
}

export async function lerSessao() {
  const token = await lerItem(CHAVE_TOKEN);
  const professor = await lerItem(CHAVE_PROFESSOR);

  if (!token || !professor) {
    return null;
  }

  return { token, professor: JSON.parse(professor) as Professor };
}

export async function limparSessao() {
  await removerItem(CHAVE_TOKEN);
  await removerItem(CHAVE_PROFESSOR);
}

import api from './api';

import type { Comentario, DadosPost, Materia, Post } from '../types';

export async function listarPosts() {
  const response = await api.get('/posts');

  return response.data as Post[];
}

export async function pesquisarPosts(termo: string) {
  const response = await api.get('/posts/search', { params: { q: termo } });

  return response.data as Post[];
}

export async function buscarPost(id: number) {
  const response = await api.get(`/posts/${id}`);

  return response.data as Post;
}

export async function criarPost(dados: DadosPost) {
  const response = await api.post('/posts', dados);

  return response.data as Post;
}

export async function atualizarPost(id: number, dados: DadosPost) {
  const response = await api.put(`/posts/${id}`, dados);

  return response.data as Post;
}

export async function excluirPost(id: number) {
  await api.delete(`/posts/${id}`);
}

export async function listarMaterias() {
  const response = await api.get('/materias');

  return response.data as Materia[];
}

export async function listarComentarios(idPost: number) {
  const response = await api.get(`/posts/${idPost}/comentarios`);

  return response.data as Comentario[];
}

// Comentário do aluno (sem login, informando o nome)
export async function criarComentario(idPost: number, nome: string, texto: string) {
  const response = await api.post(`/posts/${idPost}/comentarios`, { nome, texto });

  return response.data as Comentario;
}

// Resposta do professor a um comentário (precisa estar logado)
export async function responderComentario(idPost: number, idComentario: number, texto: string) {
  const response = await api.post(`/posts/${idPost}/comentarios/${idComentario}/resposta`, { texto });

  return response.data as Comentario;
}

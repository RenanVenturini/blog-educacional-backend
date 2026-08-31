import api from "./api";
import type { Post } from "../types/Post";

export async function listarPosts(): Promise<Post[]> {
  const response = await api.get<Post[]>("/posts");

  return response.data;
}

export async function buscarPosts(termo: string): Promise<Post[]> {
  const response = await api.get<Post[]>("/posts/search", {
    params: {
      q: termo,
    },
  });

  return response.data;
}

export async function buscarPostPorId(id: number): Promise<Post> {
  const response = await api.get<Post>(`/posts/${id}`);

  return response.data;
}

export async function criarPost(dados: {
  titulo: string;
  conteudo: string;
  idMateria: number;
}): Promise<Post> {
  const response = await api.post<Post>("/posts", dados);

  return response.data;
}
export async function atualizarPost(
  id: number,
  dados: {
    titulo: string;
    conteudo: string;
    idMateria: number;
  }
): Promise<Post> {
  const response = await api.put<Post>(`/posts/${id}`, dados);

  return response.data;
}

export async function excluirPost(id: number): Promise<void> {
  await api.delete(`/posts/${id}`);
}

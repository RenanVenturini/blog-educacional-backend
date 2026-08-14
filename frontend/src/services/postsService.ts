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
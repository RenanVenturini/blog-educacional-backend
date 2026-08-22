import axios from "axios";

export const CHAVE_TOKEN = "blog-educacional:token";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function naoAutorizado(error: unknown) {
  return (error as { response?: { status?: number } }).response?.status === 401;
}

export default api;

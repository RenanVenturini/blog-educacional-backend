import axios from 'axios';

import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// Depois do login, todas as requisições passam a enviar o token
export function definirToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Monta uma mensagem amigável para mostrar na tela quando algo dá errado
export function mensagemDeErro(error: unknown, mensagemPadrao = 'Ocorreu um erro inesperado.') {
  if (axios.isAxiosError(error)) {
    // A API devolve { message: '...' } nos erros
    if (error.response?.data?.message) {
      return error.response.data.message as string;
    }

    // Sem resposta: a API está fora do ar ou o celular não alcança o computador
    if (!error.response) {
      return `Não foi possível conectar à API (${API_URL}). Verifique se ela está no ar e se o celular está na mesma rede.`;
    }

    return mensagemPadrao;
  }

  return mensagemPadrao;
}

export default api;

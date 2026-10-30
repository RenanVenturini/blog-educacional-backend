import api from './api';

import type { DadosUsuario, ListaDeUsuarios, TipoUsuario, Usuario } from '../types';

// As rotas de professores e alunos são iguais na API (/professores e /alunos),
// então as mesmas funções servem para os dois, mudando só o `tipo`.

export async function listarUsuarios(tipo: TipoUsuario, pagina: number) {
  const response = await api.get(`/${tipo}`, { params: { pagina, limite: 10 } });

  return response.data as ListaDeUsuarios;
}

export async function buscarUsuario(tipo: TipoUsuario, id: number) {
  const response = await api.get(`/${tipo}/${id}`);

  return response.data as Usuario;
}

export async function criarUsuario(tipo: TipoUsuario, dados: DadosUsuario) {
  const response = await api.post(`/${tipo}`, dados);

  return response.data as Usuario;
}

export async function atualizarUsuario(tipo: TipoUsuario, id: number, dados: DadosUsuario) {
  const response = await api.put(`/${tipo}/${id}`, dados);

  return response.data as Usuario;
}

export async function excluirUsuario(tipo: TipoUsuario, id: number) {
  await api.delete(`/${tipo}/${id}`);
}

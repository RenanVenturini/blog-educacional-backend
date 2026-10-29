import { useRouter } from 'expo-router';

import UsuarioForm from '../../components/UsuarioForm';
import { criarUsuario } from '../../services/usuariosService';

import type { DadosUsuario } from '../../types';

export default function NovoAluno() {
  const router = useRouter();

  async function cadastrar(dados: DadosUsuario) {
    await criarUsuario('alunos', dados);
    router.back();
  }

  return <UsuarioForm textoBotao="Cadastrar aluno" aoEnviar={cadastrar} />;
}

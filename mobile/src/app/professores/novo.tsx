import { useRouter } from 'expo-router';

import UsuarioForm from '../../components/UsuarioForm';
import { criarUsuario } from '../../services/usuariosService';

import type { DadosUsuario } from '../../types';

export default function NovoProfessor() {
  const router = useRouter();

  async function cadastrar(dados: DadosUsuario) {
    await criarUsuario('professores', dados);
    router.back();
  }

  return <UsuarioForm comSenha textoBotao="Cadastrar professor" aoEnviar={cadastrar} />;
}

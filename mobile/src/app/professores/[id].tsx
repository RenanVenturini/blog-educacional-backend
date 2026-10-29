import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import UsuarioForm from '../../components/UsuarioForm';
import { Carregando, MensagemErro } from '../../components/Estados';
import { mensagemDeErro } from '../../services/api';
import { atualizarUsuario, buscarUsuario } from '../../services/usuariosService';

import type { DadosUsuario, Usuario } from '../../types';

export default function EditarProfessor() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [professor, setProfessor] = useState<Usuario | null>(null);
  const [erro, setErro] = useState('');

  // Carrega os dados atuais para preencher o formulário
  useEffect(() => {
    buscarUsuario('professores', Number(id))
      .then(setProfessor)
      .catch((error) => setErro(mensagemDeErro(error, 'Não foi possível carregar o professor.')));
  }, [id]);

  async function salvar(dados: DadosUsuario) {
    await atualizarUsuario('professores', Number(id), dados);
    router.back();
  }

  if (erro) {
    return <MensagemErro mensagem={erro} />;
  }

  if (!professor) {
    return <Carregando />;
  }

  return (
    <UsuarioForm
      comSenha
      edicao
      nomeInicial={professor.nome}
      emailInicial={professor.email}
      textoBotao="Salvar alterações"
      aoEnviar={salvar}
    />
  );
}

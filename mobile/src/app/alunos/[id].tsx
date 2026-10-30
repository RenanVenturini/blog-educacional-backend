import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import UsuarioForm from '../../components/UsuarioForm';
import { Carregando, MensagemErro } from '../../components/Estados';
import { mensagemDeErro } from '../../services/api';
import { atualizarUsuario, buscarUsuario } from '../../services/usuariosService';

import type { DadosUsuario, Usuario } from '../../types';

export default function EditarAluno() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [aluno, setAluno] = useState<Usuario | null>(null);
  const [erro, setErro] = useState('');

  // Carrega os dados atuais para preencher o formulário
  useEffect(() => {
    buscarUsuario('alunos', Number(id))
      .then(setAluno)
      .catch((error) => setErro(mensagemDeErro(error, 'Não foi possível carregar o aluno.')));
  }, [id]);

  async function salvar(dados: DadosUsuario) {
    await atualizarUsuario('alunos', Number(id), dados);
    router.back();
  }

  if (erro) {
    return <MensagemErro mensagem={erro} />;
  }

  if (!aluno) {
    return <Carregando />;
  }

  return (
    <UsuarioForm
      edicao
      nomeInicial={aluno.nome}
      emailInicial={aluno.email}
      textoBotao="Salvar alterações"
      aoEnviar={salvar}
    />
  );
}

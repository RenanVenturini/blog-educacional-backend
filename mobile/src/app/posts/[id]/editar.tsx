import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import PostForm from '../../../components/PostForm';
import { Carregando, MensagemErro } from '../../../components/Estados';
import { useAuth } from '../../../contexts/AuthContext';
import { mensagemDeErro } from '../../../services/api';
import { atualizarPost, buscarPost } from '../../../services/postsService';

import type { DadosPost, Post } from '../../../types';

export default function EditarPost() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { professor } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [erro, setErro] = useState('');

  // Carrega os dados atuais da postagem para preencher o formulário
  useEffect(() => {
    buscarPost(Number(id))
      .then(setPost)
      .catch((error) => setErro(mensagemDeErro(error, 'Não foi possível carregar a postagem.')));
  }, [id]);

  async function salvar(dados: DadosPost) {
    await atualizarPost(Number(id), dados);
    router.back();
  }

  if (erro) {
    return <MensagemErro mensagem={erro} />;
  }

  if (!post) {
    return <Carregando />;
  }

  if (post.idProfessor !== professor?.idProfessor) {
    return <MensagemErro mensagem="Você só pode editar as suas próprias postagens." />;
  }

  return (
    <PostForm
      valoresIniciais={{ titulo: post.titulo, conteudo: post.conteudo, idMateria: post.idMateria }}
      autor={post.nomeProfessor}
      textoBotao="Salvar alterações"
      aoEnviar={salvar}
    />
  );
}

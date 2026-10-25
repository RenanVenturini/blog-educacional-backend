import { useRouter } from 'expo-router';

import PostForm from '../../components/PostForm';
import { useAuth } from '../../contexts/AuthContext';
import { criarPost } from '../../services/postsService';

import type { DadosPost } from '../../types';

export default function NovoPost() {
  const router = useRouter();
  const { professor } = useAuth();

  async function publicar(dados: DadosPost) {
    const post = await criarPost(dados);

    // Troca o formulário pela tela da postagem recém-criada
    router.replace(`/posts/${post.idAula}`);
  }

  return <PostForm autor={professor?.nome ?? ''} textoBotao="Publicar" aoEnviar={publicar} />;
}

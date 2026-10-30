import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import Botao from '../../../components/Botao';
import Comentarios from '../../../components/Comentarios';
import { Carregando, MensagemErro } from '../../../components/Estados';
import { useAuth } from '../../../contexts/AuthContext';
import { mensagemDeErro } from '../../../services/api';
import { buscarPost, excluirPost } from '../../../services/postsService';
import { cores, espacos } from '../../../theme';
import { avisar, confirmar } from '../../../utils/confirmar';
import { formatarData } from '../../../utils/formatar';

import type { Post } from '../../../types';

export default function LeituraPost() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { professor } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [erro, setErro] = useState('');

  async function carregar() {
    setErro('');

    try {
      setPost(await buscarPost(Number(id)));
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível carregar a postagem.'));
    }
  }

  // Recarrega ao voltar da tela de edição
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [id])
  );

  function excluir() {
    if (!post) {
      return;
    }

    confirmar('Excluir postagem', `Deseja excluir "${post.titulo}"?`, async () => {
      try {
        await excluirPost(post.idAula);
        router.back();
      } catch (error) {
        avisar('Não foi possível excluir', mensagemDeErro(error));
      }
    });
  }

  if (erro) {
    return <MensagemErro mensagem={erro} aoTentarNovamente={carregar} />;
  }

  if (!post) {
    return <Carregando />;
  }

  // Só o professor que escreveu a postagem pode editar ou excluir
  const ehAutor = professor !== null && post.idProfessor === professor.idProfessor;

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
        <View style={styles.cabecalho}>
          <Text style={styles.tag}>{post.nomeMateria}</Text>
          <Text style={styles.titulo}>{post.titulo}</Text>
          <Text style={styles.detalhes}>
            Por <Text style={styles.autor}>{post.nomeProfessor}</Text> · {formatarData(post.dataPublicacao)}
          </Text>
        </View>

        <Text style={styles.texto} selectable>
          {post.conteudo}
        </Text>

        {ehAutor && (
          <View style={styles.acoes}>
            <Botao
              titulo="Editar"
              icone="create-outline"
              tipo="secundario"
              estilo={styles.botao}
              onPress={() => router.push(`/posts/${post.idAula}/editar`)}
            />
            <Botao titulo="Excluir" icone="trash-outline" tipo="perigo" estilo={styles.botao} onPress={excluir} />
          </View>
        )}

        <Comentarios idPost={post.idAula} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.branco,
  },
  conteudo: {
    gap: espacos.xl,
    padding: espacos.xl,
    paddingBottom: espacos.xl * 2,
  },
  cabecalho: {
    gap: espacos.sm,
    paddingBottom: espacos.lg,
    borderBottomWidth: 1,
    borderBottomColor: cores.bordaSuave,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacos.sm,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: cores.primariaClara,
    color: cores.primariaEscura,
    fontSize: 12,
    fontWeight: '600',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: cores.texto,
  },
  detalhes: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  autor: {
    fontWeight: '700',
    color: cores.destaque,
  },
  texto: {
    fontSize: 16,
    lineHeight: 26,
    color: cores.texto,
  },
  acoes: {
    flexDirection: 'row',
    gap: espacos.md,
  },
  botao: {
    flex: 1,
  },
});

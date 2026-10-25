import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import Botao from '../../components/Botao';
import { Carregando, EstadoVazio, MensagemErro } from '../../components/Estados';
import { useAuth } from '../../contexts/AuthContext';
import { mensagemDeErro } from '../../services/api';
import { excluirPost, listarPosts } from '../../services/postsService';
import { cores, espacos, raio } from '../../theme';
import { avisar, confirmar } from '../../utils/confirmar';
import { formatarData } from '../../utils/formatar';

import type { Post } from '../../types';

// Painel administrativo: lista todas as postagens.
// Editar e Excluir aparecem só nas postagens do professor logado (regra da API).
export default function Painel() {
  const router = useRouter();
  const { professor } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro('');

    try {
      setPosts(await listarPosts());
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível carregar as postagens.'));
    } finally {
      setCarregando(false);
    }
  }

  // Recarrega sempre que a tela aparece (ex.: depois de criar ou editar)
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [])
  );

  function excluir(post: Post) {
    confirmar('Excluir postagem', `Deseja excluir "${post.titulo}"?`, async () => {
      try {
        await excluirPost(post.idAula);
        carregar();
      } catch (error) {
        avisar('Não foi possível excluir', mensagemDeErro(error));
      }
    });
  }

  if (carregando && posts.length === 0) {
    return <Carregando />;
  }

  if (erro) {
    return <MensagemErro mensagem={erro} aoTentarNovamente={carregar} />;
  }

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.lista}
      data={posts}
      keyExtractor={(post) => String(post.idAula)}
      refreshing={carregando}
      onRefresh={carregar}
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Text style={styles.total}>{posts.length} postagens</Text>
          <Botao titulo="Nova postagem" icone="add" pequeno onPress={() => router.push('/posts/novo')} />
        </View>
      }
      ListEmptyComponent={<EstadoVazio mensagem="Nenhuma postagem publicada ainda." />}
      renderItem={({ item }) => {
        const ehMinha = item.idProfessor === professor?.idProfessor;

        return (
          <View style={styles.item}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.detalhes}>
              {item.nomeMateria} · {item.nomeProfessor} · {formatarData(item.dataPublicacao)}
            </Text>

            <View style={styles.acoes}>
              <Botao
                titulo="Ver"
                icone="eye-outline"
                tipo="secundario"
                pequeno
                onPress={() => router.push(`/posts/${item.idAula}`)}
              />

              {ehMinha ? (
                <>
                  <Botao
                    titulo="Editar"
                    icone="create-outline"
                    tipo="secundario"
                    pequeno
                    onPress={() => router.push(`/posts/${item.idAula}/editar`)}
                  />
                  <Botao titulo="Excluir" icone="trash-outline" tipo="perigo" pequeno onPress={() => excluir(item)} />
                </>
              ) : (
                <Text style={styles.aviso}>Somente o autor pode alterar</Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    flexGrow: 1,
    gap: espacos.sm,
    padding: espacos.lg,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: espacos.sm,
  },
  total: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  item: {
    gap: espacos.xs,
    padding: espacos.lg,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.branco,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
  },
  detalhes: {
    fontSize: 13,
    color: cores.textoSecundario,
  },
  acoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: espacos.sm,
    marginTop: espacos.sm,
  },
  aviso: {
    fontSize: 13,
    fontStyle: 'italic',
    color: cores.textoSuave,
  },
});

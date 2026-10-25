import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import Botao from './Botao';
import PostCard from './PostCard';
import { Carregando, EstadoVazio, MensagemErro } from './Estados';
import { mensagemDeErro } from '../services/api';
import { listarPosts, pesquisarPosts } from '../services/postsService';
import { cores, espacos, raio } from '../theme';

import type { Post } from '../types';

// Lista de postagens com busca: usada na Área do Aluno e na aba Postagens do professor
export default function ListaPostagens() {
  const router = useRouter();

  const [texto, setTexto] = useState(''); // o que está digitado no campo
  const [busca, setBusca] = useState(''); // o que foi pesquisado
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro('');

    try {
      if (busca) {
        setPosts(await pesquisarPosts(busca));
      } else {
        setPosts(await listarPosts());
      }
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível carregar as postagens.'));
    } finally {
      setCarregando(false);
    }
  }

  // Carrega ao abrir a tela, ao voltar para ela e quando uma nova busca é feita
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [busca])
  );

  function pesquisar() {
    setBusca(texto.trim());
  }

  function limparBusca() {
    setTexto('');
    setBusca('');
  }

  return (
    <View style={styles.tela}>
      <View style={styles.barraBusca}>
        <View style={styles.campoBusca}>
          <Ionicons name="search" size={18} color={cores.textoSuave} />
          <TextInput
            accessibilityLabel="Buscar postagens"
            style={styles.input}
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={pesquisar}
            placeholder="Título, conteúdo, professor..."
            placeholderTextColor={cores.textoSuave}
            returnKeyType="search"
            autoCorrect={false}
          />
          {texto !== '' && (
            <Ionicons name="close-circle" size={18} color={cores.textoSuave} onPress={limparBusca} accessibilityLabel="Limpar busca" />
          )}
        </View>

        <Botao titulo="Buscar" onPress={pesquisar} />
      </View>

      {carregando && posts.length === 0 ? (
        <Carregando />
      ) : erro ? (
        <MensagemErro mensagem={erro} aoTentarNovamente={carregar} />
      ) : (
        <FlatList
          contentContainerStyle={styles.lista}
          data={posts}
          keyExtractor={(post) => String(post.idAula)}
          refreshing={carregando}
          onRefresh={carregar}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <PostCard post={item} onPress={() => router.push(`/posts/${item.idAula}`)} />
          )}
          ListEmptyComponent={
            <EstadoVazio
              mensagem={busca ? `Nenhuma postagem encontrada para "${busca}".` : 'Nenhuma postagem publicada ainda.'}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  barraBusca: {
    flexDirection: 'row',
    gap: espacos.sm,
    padding: espacos.lg,
    paddingBottom: 0,
  },
  campoBusca: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    paddingHorizontal: espacos.md,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
  },
  input: {
    flex: 1,
    minHeight: 46,
    fontSize: 15,
    color: cores.texto,
  },
  lista: {
    flexGrow: 1,
    gap: espacos.md,
    padding: espacos.lg,
  },
});

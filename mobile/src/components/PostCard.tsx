import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, raio } from '../theme';
import { formatarData } from '../utils/formatar';

import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${post.titulo}, por ${post.nomeProfessor}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressionado]}
    >
      <View style={styles.topo}>
        <Text style={styles.tag}>{post.nomeMateria}</Text>
        <Text style={styles.data}>{formatarData(post.dataPublicacao)}</Text>
      </View>

      <Text style={styles.titulo}>{post.titulo}</Text>
      <Text style={styles.autor}>por {post.nomeProfessor}</Text>
      {/* Breve descrição: mostra só as 3 primeiras linhas (o texto completo fica na tela de leitura) */}
      <Text style={styles.resumo} numberOfLines={3}>
        {post.conteudo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: espacos.xs,
    padding: espacos.lg,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.branco,
  },
  pressionado: {
    opacity: 0.7,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: espacos.xs,
  },
  tag: {
    paddingHorizontal: espacos.sm,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: cores.primariaClara,
    color: cores.primariaEscura,
    fontSize: 12,
    fontWeight: '600',
  },
  data: {
    fontSize: 12,
    color: cores.textoSuave,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.texto,
  },
  autor: {
    fontSize: 13,
    color: cores.destaque,
    fontWeight: '600',
  },
  resumo: {
    marginTop: espacos.xs,
    fontSize: 14,
    lineHeight: 20,
    color: cores.textoSecundario,
  },
});

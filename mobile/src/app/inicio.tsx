import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';

import Botao from '../components/Botao';
import { cores, espacos } from '../theme';

// Tela inicial: o aluno vai direto para as postagens; o professor vai para o login
export default function Inicio() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      {/* Esta tela tem fundo claro, então a barra de status usa texto escuro */}
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.conteudo}>
        <View style={styles.marca}>
          <Ionicons name="school" size={32} color={cores.primaria} />
          <Text style={styles.titulo}>Blog Educacional</Text>
        </View>

        {/* A View define o tamanho (proporção da imagem 1536 x 1024) e a imagem ocupa a View toda */}
        <View style={styles.areaIlustracao}>
          <Image
            source={require('../../assets/home.png')}
            style={styles.ilustracao}
            resizeMode="contain"
            accessibilityLabel="Professora em uma aula online sendo assistida por um aluno"
          />
        </View>

        <View style={styles.botoes}>
          <Botao
            titulo="Área do Aluno"
            icone="book-outline"
            onPress={() => router.push('/aluno')}
          />
          <Botao
            titulo="Área do Professor"
            icone="easel-outline"
            tipo="secundario"
            onPress={() => router.push('/login')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: espacos.xl,
    padding: espacos.xl,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.sm,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '800',
    color: cores.texto,
  },
  areaIlustracao: {
    width: '100%',
    aspectRatio: 1.5,
  },
  ilustracao: {
    width: '100%',
    height: '100%',
  },
  botoes: {
    gap: espacos.md,
  },
});

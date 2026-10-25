import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ListaPostagens from '../components/ListaPostagens';
import { cores, espacos } from '../theme';

// Área do Aluno: abre direto na lista de postagens, sem login
export default function AreaDoAluno() {
  const router = useRouter();

  // Espaço da barra de status/notch no topo da tela
  const insets = useSafeAreaInsets();

  function voltarParaInicio() {
    // Normalmente o aluno veio da tela inicial; se não (ex.: recarregou a página), abre a inicial
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/inicio');
    }
  }

  return (
    <>
      {/* Barra do topo feita aqui mesmo, no lugar do cabeçalho nativo:
          no iOS 26 o cabeçalho nativo coloca um fundo branco atrás dos botões */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.barra, { paddingTop: insets.top }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para o início"
          onPress={voltarParaInicio}
          style={styles.voltar}
        >
          <Text style={styles.textoVoltar}>Início</Text>
        </Pressable>
      </View>

      <ListaPostagens />
    </>
  );
}

const styles = StyleSheet.create({
  barra: {
    backgroundColor: cores.primaria,
  },
  voltar: {
    alignSelf: 'flex-start',
    paddingVertical: espacos.md,
    paddingHorizontal: espacos.lg,
  },
  textoVoltar: {
    fontSize: 17,
    fontWeight: '600',
    color: cores.branco,
  },
});

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Carregando } from '../components/Estados';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { cores } from '../theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Texto claro na barra de status, por causa dos cabeçalhos azuis */}
      <StatusBar style="light" />
      <Navegacao />
    </AuthProvider>
  );
}

// Define quais telas podem ser abertas (Stack.Protected).
// Isso controla só a navegação; quem garante a permissão de verdade é a API.
function Navegacao() {
  const { professor, carregando } = useAuth();

  // Enquanto confere se existe um login salvo
  if (carregando) {
    return <Carregando />;
  }

  const logado = professor !== null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: cores.branco,
        headerTitleStyle: { fontWeight: '700' },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      {/* redirectTo: para onde o app vai quando a tela pedida não está liberada.
          Sem login vai para a tela inicial; com login vai para as abas do professor. */}

      {/* Sem login: tela inicial, Área do Aluno e login do professor */}
      <Stack.Protected guard={!logado} redirectTo="/">
        <Stack.Screen name="inicio" options={{ headerShown: false }} />
        <Stack.Screen name="aluno" />
        <Stack.Screen name="login" options={{ title: 'Área do Professor' }} />
      </Stack.Protected>

      {/* Professor logado */}
      <Stack.Protected guard={logado} redirectTo="/inicio">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="posts/novo" options={{ title: 'Nova postagem' }} />
        <Stack.Screen name="posts/[id]/editar" options={{ title: 'Editar postagem' }} />
        <Stack.Screen name="professores/novo" options={{ title: 'Cadastrar professor' }} />
        <Stack.Screen name="professores/[id]" options={{ title: 'Editar professor' }} />
        <Stack.Screen name="alunos/novo" options={{ title: 'Cadastrar aluno' }} />
        <Stack.Screen name="alunos/[id]" options={{ title: 'Editar aluno' }} />
      </Stack.Protected>

      {/* Leitura da postagem: aberta para alunos e professores */}
      <Stack.Screen name="posts/[id]/index" options={{ title: 'Postagem' }} />
    </Stack>
  );
}

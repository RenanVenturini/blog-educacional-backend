import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { cores } from '../../theme';

type NomeIcone = keyof typeof Ionicons.glyphMap;

function icone(nome: NomeIcone) {
  return ({ color, size }: { color: ColorValue; size: number }) => <Ionicons name={nome} size={size} color={color as string} />;
}

// Abas da Área do Professor (só aparecem depois do login)
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: cores.branco,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSuave,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Postagens', tabBarIcon: icone('newspaper-outline') }} />
      <Tabs.Screen name="admin" options={{ title: 'Painel', tabBarIcon: icone('grid-outline') }} />
      <Tabs.Screen name="professores" options={{ title: 'Professores', tabBarIcon: icone('school-outline') }} />
      <Tabs.Screen name="alunos" options={{ title: 'Alunos', tabBarIcon: icone('people-outline') }} />
      <Tabs.Screen name="conta" options={{ title: 'Conta', tabBarIcon: icone('person-circle-outline') }} />
    </Tabs>
  );
}

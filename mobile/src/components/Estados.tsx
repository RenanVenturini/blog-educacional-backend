import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import Botao from './Botao';
import { cores, espacos, raio } from '../theme';

// Componentes de estado compartilhados pelas telas: carregando, erro e lista vazia

export function Carregando() {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={cores.primaria} />
    </View>
  );
}

export function MensagemErro({ mensagem, aoTentarNovamente }: { mensagem: string; aoTentarNovamente?: () => void }) {
  return (
    <View style={styles.centro}>
      <Ionicons name="cloud-offline-outline" size={40} color={cores.erro} />
      <Text style={styles.textoErro}>{mensagem}</Text>
      {aoTentarNovamente && (
        <Botao titulo="Tentar novamente" tipo="secundario" icone="refresh" onPress={aoTentarNovamente} />
      )}
    </View>
  );
}

export function AvisoErro({ mensagem }: { mensagem: string }) {
  return (
    <View accessibilityRole="alert" style={styles.aviso}>
      <Text style={styles.textoAviso}>{mensagem}</Text>
    </View>
  );
}

export function EstadoVazio({ mensagem }: { mensagem: string }) {
  return (
    <View style={styles.centro}>
      <Ionicons name="document-text-outline" size={40} color={cores.textoSuave} />
      <Text style={styles.textoVazio}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.md,
    padding: espacos.xl,
  },
  textoErro: {
    textAlign: 'center',
    fontSize: 15,
    color: cores.erro,
  },
  textoVazio: {
    textAlign: 'center',
    fontSize: 15,
    color: cores.textoSecundario,
  },
  aviso: {
    padding: espacos.md,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.erroBorda,
    backgroundColor: cores.erroFundo,
  },
  textoAviso: {
    fontSize: 14,
    color: cores.erro,
  },
});

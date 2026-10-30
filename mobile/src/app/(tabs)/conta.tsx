import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import Botao from '../../components/Botao';
import { API_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { cores, espacos, raio } from '../../theme';

export default function Conta() {
  const { professor, sair } = useAuth();

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <View style={styles.cartao}>
        <Ionicons name="person-circle" size={64} color={cores.primaria} />
        <Text style={styles.nome}>{professor?.nome}</Text>
        <Text style={styles.email}>{professor?.email}</Text>
        <Text style={styles.perfil}>Professor</Text>
      </View>

      {/* Ao sair, o app volta para a tela inicial */}
      <Botao titulo="Sair" icone="log-out-outline" tipo="perigo" onPress={sair} />

      <Text style={styles.servidor}>Servidor: {API_URL}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    gap: espacos.lg,
    padding: espacos.lg,
  },
  cartao: {
    alignItems: 'center',
    gap: espacos.xs,
    padding: espacos.xl,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.branco,
  },
  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: cores.texto,
  },
  email: {
    fontSize: 15,
    color: cores.textoSecundario,
  },
  perfil: {
    marginTop: espacos.sm,
    paddingHorizontal: espacos.md,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: cores.primariaClara,
    color: cores.primariaEscura,
    fontSize: 13,
    fontWeight: '700',
  },
  servidor: {
    textAlign: 'center',
    fontSize: 12,
    color: cores.textoSuave,
  },
});

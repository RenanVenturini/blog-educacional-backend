import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { cores, espacos, raio } from '../theme';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  tipo?: 'primario' | 'secundario' | 'perigo';
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
  desabilitado?: boolean;
  pequeno?: boolean;
  estilo?: ViewStyle;
}

export default function Botao({
  titulo,
  onPress,
  tipo = 'primario',
  icone,
  carregando = false,
  desabilitado = false,
  pequeno = false,
  estilo,
}: BotaoProps) {
  // Cor do texto/ícone de acordo com o tipo do botão
  let corTexto = cores.branco;

  if (tipo === 'secundario') {
    corTexto = cores.primariaEscura;
  } else if (tipo === 'perigo') {
    corTexto = cores.erro;
  }

  const inativo = desabilitado || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inativo }}
      onPress={onPress}
      disabled={inativo}
      style={({ pressed }) => [
        styles.botao,
        styles[tipo],
        pequeno && styles.pequeno,
        (pressed || inativo) && styles.apagado,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={corTexto} />
      ) : (
        <>
          {icone && <Ionicons name={icone} size={pequeno ? 16 : 18} color={corTexto} />}
          <Text style={[styles.texto, pequeno && styles.textoPequeno, { color: corTexto }]}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.sm,
    minHeight: 48,
    paddingHorizontal: espacos.lg,
    borderRadius: raio,
    borderWidth: 1,
  },
  primario: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },
  secundario: {
    backgroundColor: cores.branco,
    borderColor: cores.borda,
  },
  perigo: {
    backgroundColor: cores.erroFundo,
    borderColor: cores.erroBorda,
  },
  pequeno: {
    minHeight: 36,
    paddingHorizontal: espacos.md,
  },
  apagado: {
    opacity: 0.6,
  },
  texto: {
    fontSize: 16,
    fontWeight: '600',
  },
  textoPequeno: {
    fontSize: 14,
  },
});

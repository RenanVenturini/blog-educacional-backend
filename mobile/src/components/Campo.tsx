import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { cores, espacos, raio } from '../theme';

interface CampoProps extends TextInputProps {
  rotulo: string;
  dica?: string;
}

export default function Campo({ rotulo, dica, multiline, editable = true, style, ...props }: CampoProps) {
  return (
    <View style={styles.campo}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <TextInput
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSuave}
        multiline={multiline}
        editable={editable}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multilinha, !editable && styles.somenteLeitura, style]}
        {...props}
      />

      {dica && <Text style={styles.dica}>{dica}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    gap: espacos.xs,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio,
    backgroundColor: cores.branco,
    fontSize: 16,
    color: cores.texto,
  },
  multilinha: {
    minHeight: 200,
    paddingTop: espacos.md,
  },
  somenteLeitura: {
    backgroundColor: cores.fundo,
    color: cores.textoSecundario,
  },
  dica: {
    fontSize: 12,
    color: cores.textoSecundario,
  },
});

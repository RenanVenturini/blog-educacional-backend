import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import Botao from '../components/Botao';
import Campo from '../components/Campo';
import Formulario from '../components/Formulario';
import { AvisoErro } from '../components/Estados';
import { useAuth } from '../contexts/AuthContext';
import { mensagemDeErro } from '../services/api';
import { cores, espacos, raio } from '../theme';

// Login da Área do Professor (alunos não fazem login)
export default function Login() {
  const { entrar } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }

    setErro('');
    setEnviando(true);

    try {
      // Depois do login, o _layout.tsx troca para as abas do professor automaticamente
      await entrar(email.trim().toLowerCase(), senha);
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível entrar.'));
      setEnviando(false);
    }
  }

  return (
    <Formulario>
      <View style={styles.cabecalho}>
        <View style={styles.icone}>
          <Ionicons name="easel" size={32} color={cores.branco} />
        </View>
        <Text style={styles.titulo}>Entrar como professor</Text>
      </View>

      <View style={styles.cartao}>
        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Campo
          rotulo="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholder="Sua senha"
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="go"
          onSubmitEditing={enviar}
        />

        {erro !== '' && <AvisoErro mensagem={erro} />}

        <Botao titulo="Entrar" icone="log-in-outline" onPress={enviar} carregando={enviando} />
      </View>
    </Formulario>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    alignItems: 'center',
    gap: espacos.md,
    marginTop: espacos.xl,
  },
  icone: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: cores.primaria,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: cores.texto,
  },
  cartao: {
    gap: espacos.lg,
    padding: espacos.xl,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.branco,
  },
});

import { useState } from 'react';

import Botao from './Botao';
import Campo from './Campo';
import Formulario from './Formulario';
import { AvisoErro } from './Estados';
import { mensagemDeErro } from '../services/api';

import type { DadosUsuario } from '../types';

interface UsuarioFormProps {
  nomeInicial?: string;
  emailInicial?: string;
  comSenha?: boolean; // professores têm senha (para fazer login); alunos não
  edicao?: boolean; // na edição a senha é opcional (em branco mantém a atual)
  textoBotao: string;
  aoEnviar: (dados: DadosUsuario) => Promise<void>;
}

// Formulário usado para cadastrar e editar professores e alunos
export default function UsuarioForm({
  nomeInicial = '',
  emailInicial = '',
  comSenha = false,
  edicao = false,
  textoBotao,
  aoEnviar,
}: UsuarioFormProps) {
  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    if (!nome.trim() || !email.trim()) {
      setErro('Preencha nome e e-mail.');
      return;
    }

    if (comSenha && !edicao && !senha) {
      setErro('Informe uma senha.');
      return;
    }

    if (senha && senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const dados: DadosUsuario = {
      nome: nome.trim(),
      email: email.trim(),
    };

    // Só envia a senha se algo foi digitado
    if (senha) {
      dados.senha = senha;
    }

    setErro('');
    setEnviando(true);

    try {
      await aoEnviar(dados);
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível salvar o cadastro.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Formulario>
      <Campo rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Nome completo" maxLength={255} />

      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="nome@escola.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={255}
      />

      {comSenha && (
        <Campo
          rotulo={edicao ? 'Nova senha' : 'Senha'}
          value={senha}
          onChangeText={setSenha}
          placeholder={edicao ? 'Deixe em branco para manter a atual' : 'Mínimo de 6 caracteres'}
          secureTextEntry
          autoCapitalize="none"
        />
      )}

      {erro !== '' && <AvisoErro mensagem={erro} />}

      <Botao titulo={textoBotao} icone="checkmark" onPress={enviar} carregando={enviando} />
    </Formulario>
  );
}

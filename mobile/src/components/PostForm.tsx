import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Botao from './Botao';
import Campo from './Campo';
import Formulario from './Formulario';
import { AvisoErro } from './Estados';
import { mensagemDeErro } from '../services/api';
import { listarMaterias } from '../services/postsService';
import { cores, espacos } from '../theme';

import type { DadosPost, Materia } from '../types';

interface PostFormProps {
  valoresIniciais?: DadosPost;
  // O autor é sempre o professor autenticado (a API define), por isso é só leitura
  autor: string;
  textoBotao: string;
  aoEnviar: (dados: DadosPost) => Promise<void>;
}

export default function PostForm({ valoresIniciais, autor, textoBotao, aoEnviar }: PostFormProps) {
  const [titulo, setTitulo] = useState(valoresIniciais?.titulo ?? '');
  const [conteudo, setConteudo] = useState(valoresIniciais?.conteudo ?? '');
  const [idMateria, setIdMateria] = useState<number | null>(valoresIniciais?.idMateria ?? null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    listarMaterias()
      .then(setMaterias)
      .catch((error) => setErro(mensagemDeErro(error, 'Não foi possível carregar as matérias.')));
  }, []);

  async function enviar() {
    if (!titulo.trim() || !conteudo.trim() || !idMateria) {
      setErro('Preencha título, matéria e conteúdo.');
      return;
    }

    setErro('');
    setEnviando(true);

    try {
      await aoEnviar({ titulo: titulo.trim(), conteudo: conteudo.trim(), idMateria });
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível salvar a postagem.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Formulario>
      <Campo
        rotulo="Título"
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Ex.: Introdução às frações"
        maxLength={255}
      />

      <Campo rotulo="Autor" value={autor} editable={false} dica="O autor é o professor autenticado." />

      <View style={styles.grupo}>
        <Text style={styles.rotulo}>Matéria</Text>

        <View accessibilityRole="radiogroup" style={styles.opcoes}>
          {materias.map((materia) => {
            const selecionada = materia.idMateria === idMateria;

            return (
              <Pressable
                key={materia.idMateria}
                accessibilityRole="radio"
                accessibilityState={{ selected: selecionada }}
                onPress={() => setIdMateria(materia.idMateria)}
                style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
              >
                <Text style={[styles.textoOpcao, selecionada && styles.textoOpcaoSelecionada]}>
                  {materia.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Campo
        rotulo="Conteúdo"
        value={conteudo}
        onChangeText={setConteudo}
        placeholder="Escreva o conteúdo da aula..."
        multiline
      />

      {erro !== '' && <AvisoErro mensagem={erro} />}

      <Botao titulo={textoBotao} icone="checkmark" onPress={enviar} carregando={enviando} />
    </Formulario>
  );
}

const styles = StyleSheet.create({
  grupo: {
    gap: espacos.xs,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: '600',
    color: cores.texto,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.sm,
  },
  opcao: {
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.branco,
  },
  opcaoSelecionada: {
    borderColor: cores.primaria,
    backgroundColor: cores.primaria,
  },
  textoOpcao: {
    fontSize: 14,
    color: cores.texto,
  },
  textoOpcaoSelecionada: {
    color: cores.branco,
    fontWeight: '600',
  },
});

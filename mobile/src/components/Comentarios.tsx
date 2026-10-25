import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Botao from './Botao';
import Campo from './Campo';
import { AvisoErro } from './Estados';
import { useAuth } from '../contexts/AuthContext';
import { mensagemDeErro } from '../services/api';
import { criarComentario, listarComentarios, responderComentario } from '../services/postsService';
import { cores, espacos, raio } from '../theme';
import { formatarData } from '../utils/formatar';

import type { Comentario } from '../types';

// Comentários de uma postagem:
// - o aluno (sem login) comenta informando o nome;
// - o professor (logado) não comenta no post, só responde cada comentário uma vez.
export default function Comentarios({ idPost }: { idPost: number }) {
  const { professor } = useAuth();

  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [erroLista, setErroLista] = useState('');

  useEffect(() => {
    listarComentarios(idPost)
      .then(setComentarios)
      .catch((error) => setErroLista(mensagemDeErro(error, 'Não foi possível carregar os comentários.')));
  }, [idPost]);

  // Coloca o comentário novo (ou recém-respondido) na lista
  function atualizarNaLista(comentarioAtualizado: Comentario) {
    const jaExiste = comentarios.some((c) => c.idComentario === comentarioAtualizado.idComentario);

    if (jaExiste) {
      setComentarios(
        comentarios.map((c) => (c.idComentario === comentarioAtualizado.idComentario ? comentarioAtualizado : c))
      );
    } else {
      setComentarios([...comentarios, comentarioAtualizado]);
    }
  }

  return (
    <View style={styles.secao}>
      <Text style={styles.titulo}>Comentários ({comentarios.length})</Text>

      {erroLista !== '' && <AvisoErro mensagem={erroLista} />}

      {comentarios.length === 0 && erroLista === '' && (
        <Text style={styles.textoInfo}>Ainda não há comentários.</Text>
      )}

      {comentarios.map((comentario) => (
        <ItemComentario
          key={comentario.idComentario}
          idPost={idPost}
          comentario={comentario}
          podeResponder={professor !== null}
          aoResponder={atualizarNaLista}
        />
      ))}

      {/* Só o aluno comenta no post; o professor responde pelo botão em cada comentário */}
      {!professor && <NovoComentario idPost={idPost} aoComentar={atualizarNaLista} />}
    </View>
  );
}

interface ItemComentarioProps {
  idPost: number;
  comentario: Comentario;
  podeResponder: boolean;
  aoResponder: (comentario: Comentario) => void;
}

// Um comentário do aluno + a resposta do professor (se houver)
function ItemComentario({ idPost, comentario, podeResponder, aoResponder }: ItemComentarioProps) {
  const [respondendo, setRespondendo] = useState(false);
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviarResposta() {
    if (!texto.trim()) {
      setErro('Escreva a resposta.');
      return;
    }

    setErro('');
    setEnviando(true);

    try {
      const comentarioRespondido = await responderComentario(idPost, comentario.idComentario, texto.trim());
      aoResponder(comentarioRespondido);
      setRespondendo(false);
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível enviar a resposta.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.comentario}>
      <Text style={styles.autor}>{comentario.nomeAluno}</Text>
      <Text style={styles.texto}>{comentario.texto}</Text>
      <Text style={styles.data}>{formatarData(comentario.dataComentario)}</Text>

      {comentario.resposta && (
        <View style={styles.resposta}>
          <Text style={styles.autorResposta}>Resposta de {comentario.nomeProfessorResposta}</Text>
          <Text style={styles.texto}>{comentario.resposta}</Text>
          {comentario.dataResposta && <Text style={styles.data}>{formatarData(comentario.dataResposta)}</Text>}
        </View>
      )}

      {/* Professor: botão Responder só aparece se o comentário ainda não tem resposta */}
      {podeResponder && !comentario.resposta && !respondendo && (
        <Botao
          titulo="Responder"
          icone="arrow-undo-outline"
          tipo="secundario"
          pequeno
          estilo={styles.botaoResponder}
          onPress={() => setRespondendo(true)}
        />
      )}

      {respondendo && (
        <View style={styles.formulario}>
          <Campo
            rotulo="Sua resposta"
            value={texto}
            onChangeText={setTexto}
            placeholder="Escreva a resposta ao aluno..."
            multiline
            maxLength={1000}
            style={styles.campo}
          />

          {erro !== '' && <AvisoErro mensagem={erro} />}

          <View style={styles.acoes}>
            <Botao titulo="Cancelar" tipo="secundario" pequeno onPress={() => setRespondendo(false)} />
            <Botao titulo="Enviar resposta" icone="send-outline" pequeno carregando={enviando} onPress={enviarResposta} />
          </View>
        </View>
      )}
    </View>
  );
}

interface NovoComentarioProps {
  idPost: number;
  aoComentar: (comentario: Comentario) => void;
}

// Formulário do aluno: nome + comentário
function NovoComentario({ idPost, aoComentar }: NovoComentarioProps) {
  const [nome, setNome] = useState('');
  const [texto, setTexto] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function comentar() {
    if (!nome.trim() || !texto.trim()) {
      setErro('Preencha seu nome e o comentário.');
      return;
    }

    setErro('');
    setEnviando(true);

    try {
      const novoComentario = await criarComentario(idPost, nome.trim(), texto.trim());
      aoComentar(novoComentario);

      // Limpa só o comentário; o nome fica preenchido para o próximo
      setTexto('');
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível enviar o comentário.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.formulario}>
      <Text style={styles.subtitulo}>Deixe seu comentário</Text>

      <Campo rotulo="Seu nome" value={nome} onChangeText={setNome} maxLength={100} />

      <Campo
        rotulo="Comentário"
        value={texto}
        onChangeText={setTexto}
        placeholder="Escreva aqui..."
        multiline
        maxLength={1000}
        style={styles.campo}
      />

      {erro !== '' && <AvisoErro mensagem={erro} />}

      <Botao titulo="Comentar" icone="chatbubble-outline" onPress={comentar} carregando={enviando} />
    </View>
  );
}

const styles = StyleSheet.create({
  secao: {
    gap: espacos.md,
    paddingTop: espacos.lg,
    borderTopWidth: 1,
    borderTopColor: cores.bordaSuave,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: cores.texto,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
  },
  textoInfo: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  comentario: {
    gap: espacos.xs,
    padding: espacos.md,
    borderRadius: raio,
    backgroundColor: cores.fundo,
  },
  autor: {
    fontSize: 14,
    fontWeight: '700',
    color: cores.texto,
  },
  texto: {
    fontSize: 15,
    lineHeight: 22,
    color: cores.texto,
  },
  data: {
    fontSize: 12,
    color: cores.textoSuave,
  },
  resposta: {
    gap: espacos.xs,
    marginTop: espacos.sm,
    marginLeft: espacos.md,
    padding: espacos.md,
    borderLeftWidth: 3,
    borderLeftColor: cores.primaria,
    borderRadius: raio,
    backgroundColor: cores.primariaClara,
  },
  autorResposta: {
    fontSize: 13,
    fontWeight: '700',
    color: cores.primariaEscura,
  },
  botaoResponder: {
    alignSelf: 'flex-start',
    marginTop: espacos.sm,
  },
  formulario: {
    gap: espacos.md,
    marginTop: espacos.sm,
  },
  campo: {
    minHeight: 90,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: espacos.sm,
  },
});

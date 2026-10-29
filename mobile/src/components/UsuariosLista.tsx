import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import Botao from './Botao';
import { Carregando, EstadoVazio, MensagemErro } from './Estados';
import { mensagemDeErro } from '../services/api';
import { excluirUsuario, listarUsuarios } from '../services/usuariosService';
import { cores, espacos, raio } from '../theme';
import { avisar, confirmar } from '../utils/confirmar';

import type { ListaDeUsuarios, TipoUsuario, Usuario } from '../types';

interface UsuariosListaProps {
  tipo: TipoUsuario; // 'professores' ou 'alunos'
  nome: string; // 'professor' ou 'aluno', usado nos textos da tela
}

// Listagem paginada usada nas abas Professores e Alunos
export default function UsuariosLista({ tipo, nome }: UsuariosListaProps) {
  const router = useRouter();

  const [pagina, setPagina] = useState(1);
  const [lista, setLista] = useState<ListaDeUsuarios | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    setCarregando(true);
    setErro('');

    try {
      const resultado = await listarUsuarios(tipo, pagina);
      setLista(resultado);
    } catch (error) {
      setErro(mensagemDeErro(error, 'Não foi possível carregar a lista.'));
    } finally {
      setCarregando(false);
    }
  }

  // Carrega ao abrir a tela, ao voltar para ela e ao trocar de página
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [pagina])
  );

  function excluir(usuario: Usuario, id: number) {
    confirmar(`Excluir ${nome}`, `Deseja excluir ${usuario.nome}?`, async () => {
      try {
        await excluirUsuario(tipo, id);

        // Se era o último da página, volta uma página; senão, recarrega a atual
        if (lista && lista.dados.length === 1 && pagina > 1) {
          setPagina(pagina - 1);
        } else {
          carregar();
        }
      } catch (error) {
        avisar('Não foi possível excluir', mensagemDeErro(error));
      }
    });
  }

  if (!lista && carregando) {
    return <Carregando />;
  }

  if (!lista && erro) {
    return <MensagemErro mensagem={erro} aoTentarNovamente={carregar} />;
  }

  return (
    <FlatList
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      data={lista?.dados ?? []}
      keyExtractor={(usuario) => String(usuario.idProfessor ?? usuario.idAluno)}
      refreshing={carregando}
      onRefresh={carregar}
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Text style={styles.total}>{lista?.total ?? 0} cadastrados</Text>
          <Botao titulo="Cadastrar" icone="person-add-outline" pequeno onPress={() => router.push(`/${tipo}/novo`)} />
        </View>
      }
      ListEmptyComponent={<EstadoVazio mensagem={`Nenhum ${nome} cadastrado.`} />}
      renderItem={({ item }) => {
        const id = (item.idProfessor ?? item.idAluno) as number;

        return (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.email}>{item.email}</Text>

            <View style={styles.acoes}>
              <Botao
                titulo="Editar"
                icone="create-outline"
                tipo="secundario"
                pequeno
                onPress={() => router.push(`/${tipo}/${id}`)}
              />
              <Botao titulo="Excluir" icone="trash-outline" tipo="perigo" pequeno onPress={() => excluir(item, id)} />
            </View>
          </View>
        );
      }}
      ListFooterComponent={
        lista && lista.totalPaginas > 1 ? (
          <View style={styles.paginacao}>
            <Botao
              titulo="Anterior"
              icone="chevron-back"
              tipo="secundario"
              pequeno
              desabilitado={pagina === 1}
              onPress={() => setPagina(pagina - 1)}
            />
            <Text style={styles.textoPagina}>
              Página {lista.pagina} de {lista.totalPaginas}
            </Text>
            <Botao
              titulo="Próxima"
              tipo="secundario"
              pequeno
              desabilitado={pagina === lista.totalPaginas}
              onPress={() => setPagina(pagina + 1)}
            />
          </View>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flexGrow: 1,
    gap: espacos.sm,
    padding: espacos.lg,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: espacos.sm,
  },
  total: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  item: {
    gap: 2,
    padding: espacos.lg,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.bordaSuave,
    backgroundColor: cores.branco,
  },
  nome: {
    fontSize: 16,
    fontWeight: '700',
    color: cores.texto,
  },
  email: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
  acoes: {
    flexDirection: 'row',
    gap: espacos.sm,
    marginTop: espacos.md,
  },
  paginacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: espacos.md,
  },
  textoPagina: {
    fontSize: 14,
    color: cores.textoSecundario,
  },
});

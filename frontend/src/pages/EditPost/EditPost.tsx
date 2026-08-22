import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PainelLayout from "../../components/PainelLayout/PainelLayout";
import PostForm, { type DadosPost } from "../../components/PostForm/PostForm";

import type { Post } from "../../types/Post";
import { naoAutorizado } from "../../services/api";
import { atualizarPost, buscarPostPorId } from "../../services/postsService";

import "./EditPost.css";

function EditPost() {
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    buscarPostPorId(Number(id))
      .then(setPost)
      .catch(() => setErro("Não foi possível carregar a postagem."))
      .finally(() => setCarregando(false));
  }, [id]);

  async function salvarAlteracoes(dados: DadosPost) {
    setMensagem("");
    setErro("");
    setSalvando(true);

    try {
      setPost(await atualizarPost(Number(id), dados));
      setMensagem("Alterações salvas com sucesso!");
    } catch (error) {
      setErro(
        naoAutorizado(error)
          ? "Sua sessão expirou. Faça login novamente."
          : "Não foi possível salvar as alterações."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <PainelLayout
      titulo="Editar Post"
      subtitulo="Altere os dados da aula e salve as mudanças."
    >
      {carregando && <p className="edit-post__aviso">Carregando postagem...</p>}

      {!carregando && !post && (
        <p className="edit-post__aviso edit-post__aviso--erro" role="alert">
          {erro || "Postagem não encontrada."}
        </p>
      )}

      {!carregando && post && (
        <PostForm
          valoresIniciais={post}
          textoBotao="Salvar alterações"
          salvando={salvando}
          mensagem={mensagem}
          erro={erro}
          aoSalvar={salvarAlteracoes}
        />
      )}
    </PainelLayout>
  );
}

export default EditPost;

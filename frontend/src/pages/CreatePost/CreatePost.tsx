import { useState } from "react";

import PainelLayout from "../../components/PainelLayout/PainelLayout";
import PostForm, { type DadosPost } from "../../components/PostForm/PostForm";

import { useAuth } from "../../contexts/authContext";
import { naoAutorizado } from "../../services/api";
import { criarPost } from "../../services/postsService";

function CreatePost() {
  const { professor } = useAuth();

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [chaveFormulario, setChaveFormulario] = useState(0);

  async function salvarPost(dados: DadosPost) {
    setMensagem("");
    setErro("");
    setSalvando(true);

    try {
      await criarPost(dados);

      setMensagem("Post criado com sucesso!");
      setChaveFormulario((valor) => valor + 1);
    } catch (error) {
      setErro(
        naoAutorizado(error)
          ? "Sua sessão expirou. Faça login novamente."
          : "Não foi possível criar o post."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <PainelLayout
      titulo="Novo Post"
      subtitulo="Preencha os dados da aula que será publicada."
    >
      <PostForm
        key={chaveFormulario}
        autor={professor?.nome ?? ""}
        textoBotao="Salvar"
        salvando={salvando}
        mensagem={mensagem}
        erro={erro}
        aoSalvar={salvarPost}
      />
    </PainelLayout>
  );
}

export default CreatePost;

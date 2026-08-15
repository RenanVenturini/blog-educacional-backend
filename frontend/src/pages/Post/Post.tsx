import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { Post as PostType } from "../../types/Post";
import { buscarPostPorId } from "../../services/postsService";

import "./Post.css";

function Post() {
  const { id } = useParams();

  const [post, setPost] = useState<PostType | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPost() {
      try {
        setCarregando(true);

        const resultado = await buscarPostPorId(Number(id));

        setPost(resultado);
      } catch (error) {
        console.error("ERRO AO BUSCAR POST:", error);
        setErro("Não foi possível carregar o post.");
      } finally {
        setCarregando(false);
      }
    }

    carregarPost();
  }, [id]);

  if (carregando) {
    return <p>Carregando...</p>;
  }

  if (erro) {
    return <p>{erro}</p>;
  }

  if (!post) {
    return <p>Post não encontrado.</p>;
  }

  return (
    <main className="post-page">
      <h1>{post.titulo}</h1>

      <p>
        <strong>Professor:</strong> {post.nomeProfessor}
      </p>

      <p>
        <strong>Matéria:</strong> {post.nomeMateria}
      </p>

      <hr />

      <div className="post-content">
        {post.conteudo}
      </div>

      <hr />

      <Link to="/">Voltar</Link>
    </main>
  );
}

export default Post;
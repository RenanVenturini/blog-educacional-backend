import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import type { Post as PostType } from "../../types/Post";
import { buscarPostPorId } from "../../services/postsService";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import "./Post.css";

function Post() {
  const { id } = useParams();
  const location = useLocation();
  const veioDoPainel =
    (location.state as { de?: string } | null)?.de === "/admin";

  const [post, setPost] = useState<PostType | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPost() {
      try {
        setCarregando(true);
        setErro("");

        const resultado = await buscarPostPorId(Number(id));

        setPost(resultado);
      } catch (error) {
        console.error("ERRO AO BUSCAR POST:", error);
        setErro("Não foi possível carregar a postagem.");
      } finally {
        setCarregando(false);
      }
    }

    carregarPost();
  }, [id]);

  return (
    <>
      <Header />

      <main className="post-page">

        <div className="post-page__container">

          {carregando && (
            <p className="post-page__aviso">Carregando postagem...</p>
          )}

          {!carregando && erro && (
            <p className="post-page__aviso post-page__aviso--erro" role="alert">
              {erro}
            </p>
          )}

          {!carregando && !erro && !post && (
            <p className="post-page__aviso">Postagem não encontrada.</p>
          )}

          {!carregando && !erro && post && (

            <article className="post-page__cartao">

              <div className="post-page__tags">
                <span className="post-page__tag">{post.nomeMateria}</span>
              </div>

              <h1 className="post-page__titulo">{post.titulo}</h1>

              <p className="post-page__meta">
                {post.nomeProfessor} ·{" "}
                {new Date(post.dataPublicacao).toLocaleDateString("pt-BR")}
              </p>

              <div className="post-page__conteudo">
                {post.conteudo}
              </div>

            </article>

          )}

          <Link
            to={veioDoPainel ? "/admin" : "/aluno"}
            className="post-page__voltar"
          >
            {veioDoPainel ? "Voltar ao painel" : "Voltar para as postagens"}
          </Link>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Post;

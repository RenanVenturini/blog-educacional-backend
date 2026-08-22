import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PainelLayout from "../../components/PainelLayout/PainelLayout";

import type { Post } from "../../types/Post";
import { naoAutorizado } from "../../services/api";
import { excluirPost, listarPosts } from "../../services/postsService";

import "./Admin.css";

function Admin() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [confirmando, setConfirmando] = useState<number | null>(null);
  const [excluindo, setExcluindo] = useState<number | null>(null);

  useEffect(() => {
    carregarPosts();
  }, []);

  async function carregarPosts() {
    try {
      setPosts(await listarPosts());
    } catch {
      setErro("Não foi possível conectar à API. Verifique se o servidor está no ar.");
    } finally {
      setCarregando(false);
    }
  }

  async function confirmarExclusao(idAula: number) {
    setErro("");

    setExcluindo(idAula);

    try {
      await excluirPost(idAula);

      setPosts((atuais) => atuais.filter((post) => post.idAula !== idAula));
      setConfirmando(null);
    } catch (error) {
      setErro(
        naoAutorizado(error)
          ? "Sua sessão expirou. Faça login novamente."
          : "Não foi possível excluir a postagem."
      );
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <PainelLayout
      titulo="Painel do Professor"
      subtitulo="Gerencie as postagens publicadas: edite ou exclua cada aula."
      largo
    >

      <div className="admin__barra">
        <span className="admin__contagem">
          {posts.length === 1 ? "1 postagem" : `${posts.length} postagens`}
        </span>

        <Link to="/posts/novo" className="admin__novo">
          + Nova postagem
        </Link>
      </div>

      {erro && (
        <p className="admin__aviso admin__aviso--erro" role="alert">
          {erro}
        </p>
      )}

      {carregando && (
        <p className="admin__aviso">Carregando postagens...</p>
      )}

      {!carregando && posts.length === 0 && (
        <p className="admin__aviso">Nenhuma postagem publicada ainda.</p>
      )}

      {!carregando && posts.length > 0 && (

        <ul className="admin__lista">

          {posts.map((post) => (

            <li key={post.idAula} className="admin__item">

              <div className="admin__dados">
                <span className="admin__tag">{post.nomeMateria}</span>

                <h2 className="admin__titulo-post">{post.titulo}</h2>

                <p className="admin__meta">
                  {post.nomeProfessor} ·{" "}
                  {new Date(post.dataPublicacao).toLocaleDateString("pt-BR")}
                </p>
              </div>

              {confirmando === post.idAula ? (

                <div className="admin__acoes">
                  <span className="admin__pergunta">Excluir?</span>

                  <button
                    type="button"
                    className="admin__botao admin__botao--perigo"
                    onClick={() => confirmarExclusao(post.idAula)}
                    disabled={excluindo === post.idAula}
                  >
                    {excluindo === post.idAula ? "Excluindo..." : "Confirmar"}
                  </button>

                  <button
                    type="button"
                    className="admin__botao"
                    onClick={() => setConfirmando(null)}
                  >
                    Cancelar
                  </button>
                </div>

              ) : (

                <div className="admin__acoes">
                  <Link
                    to={`/posts/${post.idAula}`}
                    state={{ de: "/admin" }}
                    className="admin__botao"
                  >
                    Ver
                  </Link>

                  <Link
                    to={`/posts/${post.idAula}/editar`}
                    className="admin__botao admin__botao--principal"
                  >
                    Editar
                  </Link>

                  <button
                    type="button"
                    className="admin__botao admin__botao--perigo"
                    onClick={() => setConfirmando(post.idAula)}
                  >
                    Excluir
                  </button>
                </div>

              )}

            </li>

          ))}

        </ul>

      )}

    </PainelLayout>
  );
}

export default Admin;

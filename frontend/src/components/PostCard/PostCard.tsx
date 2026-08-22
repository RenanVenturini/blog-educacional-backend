import { Link } from "react-router-dom";
import type { Post } from "../../types/Post";
import "./PostCard.css";

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const descricao =
    post.conteudo.length > 180
      ? `${post.conteudo.substring(0, 180)}...`
      : post.conteudo;

  const data = new Date(post.dataPublicacao).toLocaleDateString("pt-BR");

  return (
    <article className="post-card">
      <div className="post-card__tags">
        <span className="post-card__tag">{post.nomeMateria}</span>
      </div>

      <h2 className="post-card__titulo">{post.titulo}</h2>

      <p className="post-card__meta">
        {post.nomeProfessor} · {data}
      </p>

      <p className="post-card__resumo">{descricao}</p>

      <Link to={`/posts/${post.idAula}`} className="post-card__link">
        Ler mais
      </Link>
    </article>
  );
}

export default PostCard;

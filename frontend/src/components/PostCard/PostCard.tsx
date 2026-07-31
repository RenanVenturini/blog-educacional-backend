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

  return (
    <article className="post-card">
      <h2>{post.titulo}</h2>

      <p>
        <strong>Professor:</strong> {post.nomeProfessor}
      </p>

      <p>
        <strong>Matéria:</strong> {post.nomeMateria}
      </p>

      <p>{descricao}</p>

      <Link to={`/posts/${post.idAula}`}>
        Ler mais
      </Link>
    </article>
  );
}

export default PostCard;
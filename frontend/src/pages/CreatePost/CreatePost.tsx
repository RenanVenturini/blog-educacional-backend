import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { criarPost } from "../../services/postsService";

import "./CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [idProfessor, setIdProfessor] = useState("");
  const [idMateria, setIdMateria] = useState("");
  const [conteudo, setConteudo] = useState("");

  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function salvarPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem("");
    setErro("");

    try {
      setSalvando(true);

      await criarPost({
        titulo,
        conteudo,
        idProfessor: Number(idProfessor),
        idMateria: Number(idMateria),
      });

      setMensagem("✅ Post criado com sucesso!");

      setTitulo("");
      setIdProfessor("");
      setIdMateria("");
      setConteudo("");

    } catch (error) {
      console.error(error);
      setErro("❌ Não foi possível criar o post.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="create-post-page">
      <h1>Novo Post</h1>

      <form onSubmit={salvarPost}>

        <label htmlFor="titulo">
          Título
        </label>

        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(event) => setTitulo(event.target.value)}
          required
        />

        <label htmlFor="professor">
          Autor
        </label>

        <select
          id="professor"
          value={idProfessor}
          onChange={(event) => setIdProfessor(event.target.value)}
          required
        >
          <option value="">Selecione um professor</option>
          <option value="1">Prof. João</option>
          <option value="2">Prof. Maria</option>
        </select>

        <label htmlFor="materia">
          Matéria
        </label>

        <select
          id="materia"
          value={idMateria}
          onChange={(event) => setIdMateria(event.target.value)}
          required
        >
          <option value="">Selecione uma matéria</option>
          <option value="1">Matemática</option>
          <option value="2">Português</option>
          <option value="3">História</option>
        </select>

        <label htmlFor="conteudo">
          Conteúdo
        </label>

        <textarea
          id="conteudo"
          value={conteudo}
          onChange={(event) => setConteudo(event.target.value)}
          required
        />

        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar"}
        </button>

      </form>

      {mensagem && (
        <p className="success-message">
          {mensagem}
        </p>
      )}

      {erro && (
        <p className="error-message">
          {erro}
        </p>
      )}

      <Link to="/">
        Voltar
      </Link>
    </main>
  );
}

export default CreatePost;
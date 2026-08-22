import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import "./PostForm.css";

export interface DadosPost {
  titulo: string;
  conteudo: string;
  idProfessor: number;
  idMateria: number;
}

interface PostFormProps {
  valoresIniciais?: DadosPost;
  textoBotao: string;
  salvando: boolean;
  mensagem?: string;
  erro?: string;
  aoSalvar: (dados: DadosPost) => void;
}

function PostForm({
  valoresIniciais,
  textoBotao,
  salvando,
  mensagem,
  erro,
  aoSalvar,
}: PostFormProps) {
  const [titulo, setTitulo] = useState(valoresIniciais?.titulo ?? "");
  const [conteudo, setConteudo] = useState(valoresIniciais?.conteudo ?? "");
  const [idProfessor, setIdProfessor] = useState(
    String(valoresIniciais?.idProfessor ?? "")
  );
  const [idMateria, setIdMateria] = useState(
    String(valoresIniciais?.idMateria ?? "")
  );

  function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    aoSalvar({
      titulo,
      conteudo,
      idProfessor: Number(idProfessor),
      idMateria: Number(idMateria),
    });
  }

  return (
    <>
      <form className="post-form" onSubmit={enviar}>

        <div className="post-form__campo">
          <label htmlFor="titulo" className="post-form__label">
            Título
          </label>

          <input
            id="titulo"
            type="text"
            className="post-form__input"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Ex.: Introdução ao Node.js"
            required
          />
        </div>

        <div className="post-form__linha">

          <div className="post-form__campo">
            <label htmlFor="professor" className="post-form__label">
              Autor
            </label>

            <select
              id="professor"
              className="post-form__input post-form__select"
              value={idProfessor}
              onChange={(event) => setIdProfessor(event.target.value)}
              required
            >
              <option value="">Selecione um professor</option>
              <option value="1">Prof. João</option>
              <option value="2">Prof. Maria</option>
            </select>
          </div>

          <div className="post-form__campo">
            <label htmlFor="materia" className="post-form__label">
              Matéria
            </label>

            <select
              id="materia"
              className="post-form__input post-form__select"
              value={idMateria}
              onChange={(event) => setIdMateria(event.target.value)}
              required
            >
              <option value="">Selecione uma matéria</option>
              <option value="1">Matemática</option>
              <option value="2">Português</option>
              <option value="3">História</option>
            </select>
          </div>

        </div>

        <div className="post-form__campo">
          <label htmlFor="conteudo" className="post-form__label">
            Conteúdo
          </label>

          <textarea
            id="conteudo"
            className="post-form__input post-form__textarea"
            value={conteudo}
            onChange={(event) => setConteudo(event.target.value)}
            placeholder="Escreva o conteúdo da aula..."
            required
          />
        </div>

        <div className="post-form__acoes">
          <button type="submit" className="post-form__botao" disabled={salvando}>
            {salvando ? "Salvando..." : textoBotao}
          </button>

          <Link to="/admin" className="post-form__voltar">
            Voltar ao painel
          </Link>
        </div>

      </form>

      {mensagem && (
        <p className="post-form__mensagem post-form__mensagem--sucesso" role="status">
          {mensagem}
        </p>
      )}

      {erro && (
        <p className="post-form__mensagem post-form__mensagem--erro" role="alert">
          {erro}
        </p>
      )}
    </>
  );
}

export default PostForm;

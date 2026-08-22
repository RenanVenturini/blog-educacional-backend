import { Link } from "react-router-dom";

import FundoDecorativo from "../../components/FundoDecorativo/FundoDecorativo";

import ilustracao from "../../assets/home.png";
import iconeChapeu from "../../assets/icons/chapeu.svg";
import iconeAluno from "../../assets/icons/aluno.svg";
import iconeProfessor from "../../assets/icons/professor.svg";

import "./Landing.css";

function Landing() {
  return (
    <main className="landing">

      <FundoDecorativo />

      <div className="landing__container">

        <section className="landing__marca">
          <img
            src={iconeChapeu}
            alt=""
            aria-hidden="true"
            className="landing__marca-icone"
          />

          <h1 className="landing__titulo">Blog Educacional</h1>
        </section>

        <img
          src={ilustracao}
          alt="Professora em uma aula online sendo assistida por um aluno"
          className="landing__ilustracao"
        />

        <nav className="landing__acoes" aria-label="Escolha sua área">

          <Link to="/aluno" className="botao botao--primario">
            <img src={iconeAluno} alt="" aria-hidden="true" className="botao__icone" />

            <span className="botao__texto">Área do Aluno</span>
          </Link>

          <Link to="/login" className="botao botao--secundario">
            <img src={iconeProfessor} alt="" aria-hidden="true" className="botao__icone" />

            <span className="botao__texto">Área do Professor</span>
          </Link>

        </nav>

      </div>

    </main>
  );
}

export default Landing;

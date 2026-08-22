import { Link, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../../contexts/authContext";

import FundoDecorativo from "../FundoDecorativo/FundoDecorativo";

import iconeChapeu from "../../assets/icons/chapeu.svg";

import "./PainelLayout.css";

interface PainelLayoutProps {
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  largo?: boolean;
}

function PainelLayout({
  titulo,
  subtitulo,
  children,
  largo = false,
}: PainelLayoutProps) {
  const navigate = useNavigate();
  const { professor, sair } = useAuth();

  return (
    <main className="painel">

      <FundoDecorativo />

      <div className={largo ? "painel__container painel__container--largo" : "painel__container"}>

        <section className="painel__cartao">

          <div className="painel__sessao">
            <nav className="painel__nav" aria-label="Navegação">
              <Link to="/" className="painel__inicio">
                Início
              </Link>
            </nav>

            <div className="painel__conta">
              <span className="painel__usuario">
                Conectado como <strong>{professor?.nome}</strong>
              </span>

              <button
                type="button"
                className="painel__sair"
                onClick={() => {
                  sair();
                  navigate("/login");
                }}
              >
                Sair
              </button>
            </div>
          </div>

          <header className="painel__cabecalho">
            <img
              src={iconeChapeu}
              alt=""
              aria-hidden="true"
              className="painel__icone"
            />

            <h1 className="painel__titulo">{titulo}</h1>

            <p className="painel__subtitulo">{subtitulo}</p>
          </header>

          {children}

        </section>

      </div>

    </main>
  );
}

export default PainelLayout;

import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "../../contexts/authContext";

import FundoDecorativo from "../FundoDecorativo/FundoDecorativo";

import "./RotaPrivada.css";

function RotaPrivada({ children }: { children: ReactNode }) {
  const { autenticado, carregando } = useAuth();

  if (!carregando && autenticado) {
    return <>{children}</>;
  }

  return (
    <main className="acesso-negado">

      <FundoDecorativo />

      <div className="acesso-negado__container">

        {carregando ? (

          <p className="acesso-negado__verificando">Verificando acesso...</p>

        ) : (

          <section className="acesso-negado__cartao">
            <span className="acesso-negado__icone" aria-hidden="true">
              🔒
            </span>

            <h1 className="acesso-negado__titulo">Acesso negado</h1>

            <p className="acesso-negado__texto">Faça login para continuar.</p>

            <Link to="/login" className="acesso-negado__botao">
              Ir para o login
            </Link>

            <Link to="/" className="acesso-negado__voltar">
              Voltar para o início
            </Link>
          </section>

        )}

      </div>

    </main>
  );
}

export default RotaPrivada;

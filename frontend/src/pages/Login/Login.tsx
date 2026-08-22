import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/authContext";
import { naoAutorizado } from "../../services/api";

import FundoDecorativo from "../../components/FundoDecorativo/FundoDecorativo";

import iconeChapeu from "../../assets/icons/chapeu.svg";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { entrar: autenticar, autenticado, carregando } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setEnviando(true);

    try {
      await autenticar(email, senha);

      navigate("/admin");
    } catch (error) {
      setErro(
        naoAutorizado(error)
          ? "E-mail ou senha inválidos."
          : "Não foi possível conectar à API. Verifique se o servidor está no ar."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (!carregando && autenticado) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="login">

      <FundoDecorativo />

      <div className="login__container">

        <section className="login__cartao">

          <img
            src={iconeChapeu}
            alt=""
            aria-hidden="true"
            className="login__icone"
          />

          <h1 className="login__titulo">Área do Professor</h1>

          <p className="login__subtitulo">
            Entre com suas credenciais para gerenciar as postagens.
          </p>

          <form className="login__form" onSubmit={entrar}>

            <div className="login__campo">
              <label htmlFor="email" className="login__label">
                E-mail
              </label>

              <input
                id="email"
                type="email"
                className="login__input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="professor@escola.com"
                autoComplete="username"
                required
              />
            </div>

            <div className="login__campo">
              <label htmlFor="senha" className="login__label">
                Senha
              </label>

              <input
                id="senha"
                type="password"
                className="login__input"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="login__botao" disabled={enviando}>
              {enviando ? "Entrando..." : "Entrar"}
            </button>

          </form>

          {erro && (
            <p className="login__erro" role="alert">
              {erro}
            </p>
          )}

          <Link to="/" className="login__voltar">
            Voltar para o início
          </Link>

        </section>

      </div>

    </main>
  );
}

export default Login;

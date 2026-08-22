import { useEffect, useState, type ReactNode } from "react";

import type { Professor } from "../types/Professor";

import {
  buscarPerfil,
  limparSessao,
  login,
  obterProfessor,
  obterToken,
  salvarSessao,
} from "../services/authService";

import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [professor, setProfessor] = useState<Professor | null>(obterProfessor);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!obterToken()) {
      setProfessor(null);
      setCarregando(false);
      return;
    }

    buscarPerfil()
      .then(setProfessor)
      .catch(() => {
        limparSessao();
        setProfessor(null);
      })
      .finally(() => setCarregando(false));
  }, []);

  async function entrar(email: string, senha: string) {
    const dados = await login(email, senha);

    salvarSessao(dados);
    setProfessor(dados.professor);
  }

  function sair() {
    limparSessao();
    setProfessor(null);
  }

  return (
    <AuthContext.Provider
      value={{
        professor,
        autenticado: professor !== null,
        carregando,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

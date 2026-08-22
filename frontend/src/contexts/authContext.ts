import { createContext, useContext } from "react";

import type { Professor } from "../types/Professor";

export interface AuthContextData {
  professor: Professor | null;
  autenticado: boolean;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }

  return contexto;
}

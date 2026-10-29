import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import axios from 'axios';

import { definirToken } from '../services/api';
import { buscarPerfil, lerSessao, limparSessao, login, salvarSessao } from '../services/authService';

import type { Professor } from '../types';

// Só professores fazem login. Alunos usam o app sem login (Área do Aluno).
interface AuthContextValue {
  professor: Professor | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Ao abrir o app, recupera o login salvo (se existir)
  useEffect(() => {
    async function restaurarSessao() {
      const sessao = await lerSessao();

      if (sessao) {
        definirToken(sessao.token);
        setProfessor(sessao.professor);

        try {
          // Confere se o token ainda vale (ele expira depois de algumas horas)
          const perfil = await buscarPerfil();
          setProfessor(perfil);
        } catch (error) {
          // 401 = token vencido ou inválido: pede login de novo.
          // Outros erros (ex.: API fora do ar) mantêm o login salvo.
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            await sair();
          }
        }
      }

      setCarregando(false);
    }

    restaurarSessao();
  }, []);

  async function entrar(email: string, senha: string) {
    const resposta = await login(email, senha);

    await salvarSessao(resposta.token, resposta.professor);
    definirToken(resposta.token);
    setProfessor(resposta.professor);
  }

  async function sair() {
    definirToken(null);
    setProfessor(null);
    await limparSessao();
  }

  return (
    <AuthContext.Provider value={{ professor, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider.');
  }

  return contexto;
}

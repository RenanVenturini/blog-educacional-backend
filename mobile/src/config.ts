import Constants from 'expo-constants';

// Ordem de prioridade para descobrir a URL da API:
// 1. EXPO_PUBLIC_API_URL (arquivo mobile/.env.local)
// 2. Mesmo IP da máquina que roda o `expo start`, na porta 3000 — funciona no Expo Go
//    do celular sem configurar nada, desde que celular e PC estejam na mesma rede
// 3. localhost (Expo Web no próprio computador)
function descobrirApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  return `http://${host ?? 'localhost'}:3000`;
}

export const API_URL = descobrirApiUrl();

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// No celular os dados ficam no armazenamento seguro do sistema (Keychain/Keystore).
// O SecureStore não existe na web, então no Expo Web usamos o localStorage.
const naWeb = Platform.OS === 'web';

export async function lerItem(chave: string) {
  if (naWeb) {
    return localStorage.getItem(chave);
  }

  return SecureStore.getItemAsync(chave);
}

export async function salvarItem(chave: string, valor: string) {
  if (naWeb) {
    localStorage.setItem(chave, valor);
    return;
  }

  await SecureStore.setItemAsync(chave, valor);
}

export async function removerItem(chave: string) {
  if (naWeb) {
    localStorage.removeItem(chave);
    return;
  }

  await SecureStore.deleteItemAsync(chave);
}

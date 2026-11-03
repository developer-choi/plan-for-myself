import * as SecureStore from 'expo-secure-store';

/**
 * null: 저장된 토큰이 없다(로그인하지 않았거나 로그아웃했다)
 */
export function getAppToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY_APP_TOKEN);
}

export function saveAppToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(KEY_APP_TOKEN, token);
}

export function deleteAppToken(): Promise<void> {
  return SecureStore.deleteItemAsync(KEY_APP_TOKEN);
}

const KEY_APP_TOKEN = 'appToken';

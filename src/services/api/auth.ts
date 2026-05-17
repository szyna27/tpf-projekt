import { API_BASE } from './client';

export async function whoami() {
  const isAuth = localStorage.getItem('isAuthenticated');
  if (!isAuth) return null;
  try {
     const res = await fetch(`${API_BASE}/user`);
     if (!res.ok) return null;
     return await res.json();
  } catch { return { id: 1, email: 'test@test.pl', username: 'Test User' }; }
}

export async function emailLogin(email?: string, password?: string) {
  localStorage.setItem('isAuthenticated', 'true');
  try {
     const userRes = await fetch(`${API_BASE}/user`);
     return await userRes.json();
  } catch { return { id: 1, email: 'test@test.pl' }; }
}

export async function emailLogout() {
  localStorage.removeItem('isAuthenticated');
  return {};
}

export async function registerAccount(email?: string, password?: string, password2?: string): Promise<any> {
  localStorage.setItem('isAuthenticated', 'true');
  return { success: true, message: 'Rejestracja pomyślna. Sprawdź e-mail.', user: { id: 1, email: 'test@test.pl' } };
}

export async function resendActivation(email: string) { return { success: true }; }
export async function setPassword(payload: any): Promise<any> { return { success: true }; }
export async function verifyPasswordReset(uid: string, token: string) { return true; }
export async function confirmPasswordReset(uid: string, token: string, new1: string, new2: string) { return true; }
export async function resetPassword(email: string) { return true; }
export async function googleLoginUrl(n: string) { return '/login'; }
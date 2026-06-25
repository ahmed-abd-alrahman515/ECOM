import { mockGetMe, mockLogin, mockLogout, mockRegister } from '@/lib/api/mock';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/lib/types/api';

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  return mockLogin(payload);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  return mockRegister(payload);
}

export async function logout(): Promise<void> {
  return mockLogout();
}

export async function getMe(): Promise<User> {
  return mockGetMe();
}

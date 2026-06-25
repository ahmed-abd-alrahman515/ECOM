import { mockForgotPassword, mockResetPassword, mockSubmitContact } from '@/lib/api/mock';

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export async function submitContact(payload: ContactPayload): Promise<void> {
  return mockSubmitContact(payload);
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  return mockForgotPassword(payload);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  return mockResetPassword(payload);
}

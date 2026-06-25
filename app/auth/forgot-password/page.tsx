'use client';

import { AuthLayout } from '@/components/auth/auth-layout';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { useI18n } from '@/components/i18n-provider';

export default function ForgotPasswordPage() {
  const { t } = useI18n();

  return (
    <AuthLayout 
      imageSrc="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=1200&fit=crop"
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}

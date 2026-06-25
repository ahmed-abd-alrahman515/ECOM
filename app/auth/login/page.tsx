'use client';

import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';
import { useI18n } from '@/components/i18n-provider';

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <AuthLayout
      title={t('auth.login.title')}
      subtitle={t('hero.subtitle')}
    >
      <LoginForm />
    </AuthLayout>
  );
}

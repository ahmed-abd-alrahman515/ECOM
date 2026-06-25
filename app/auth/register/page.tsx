'use client';

import { AuthLayout } from '@/components/auth/auth-layout';
import { RegisterForm } from '@/components/auth/register-form';
import { useI18n } from '@/components/i18n-provider';

export default function RegisterPage() {
  const { t } = useI18n();

  return (
    <AuthLayout
      imageSrc="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1200&fit=crop"
      title={t('auth.register.title')}
      subtitle={t('cta.explore')}
    >
      <RegisterForm />
    </AuthLayout>
  );
}

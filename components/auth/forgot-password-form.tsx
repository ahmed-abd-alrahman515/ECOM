'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/components/i18n-provider';
import { forgotPassword } from '@/lib/api/support';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword({ email });
      setIsSubmitted(true);
      toast.success('Password reset email sent');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center py-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-accent animate-bounce" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to your email address.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full rounded-xl py-6 font-medium border-border/50 hover:bg-secondary/50 transition-colors">
          <Link href="/auth/login" className="block w-full">
            {t('auth.forgotPassword.backToLogin')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
          {t('auth.forgotPassword.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('auth.forgotPassword.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.register.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-border/50 focus:border-accent"
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-xl py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all mt-6"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t('auth.forgotPassword.button')}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-sm font-bold text-accent hover:underline gap-2"
        >
          <ArrowLeft size={16} />
          {t('auth.forgotPassword.backToLogin')}
        </Link>
      </div>
    </div>
  );
}

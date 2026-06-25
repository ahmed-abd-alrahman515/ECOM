'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Mail, MessageSquareText, PhoneCall, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import { useI18n } from '@/components/i18n-provider';
import { submitContact } from '@/lib/api/support';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { t } = useI18n();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success('Message sent successfully');

      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-foreground/70">{t('contact.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm animate-in fade-in slide-in-from-left-4 duration-700 sm:p-8">
            <div className="mb-8 space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Customer Support
              </p>
              <h2 className="text-2xl font-bold text-foreground">Send us a message</h2>
            </div>

            {submitted && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-emerald-700">
                {t('contact.thanks')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {t('contact.name')}
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    name="name"
                    placeholder={t('contact.name.placeholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {t('contact.email')}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    placeholder={t('contact.email.placeholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {t('contact.subject')}
                </label>
                <div className="relative">
                  <MessageSquareText className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    name="subject"
                    placeholder={t('contact.subject.placeholder')}
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {t('contact.message')}
                </label>
                <div className="relative">
                  <Send className="pointer-events-none absolute left-4 top-5 h-5 w-5 text-muted-foreground" />
                  <textarea
                    name="message"
                    placeholder={t('contact.message.placeholder')}
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    required
                    className="min-h-40 w-full rounded-[1.5rem] border border-input bg-background/80 px-4 py-4 pl-12 text-base text-foreground shadow-xs outline-none transition-[color,box-shadow,transform] placeholder:text-muted-foreground focus:border-ring focus:ring-[4px] focus:ring-ring/40"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('contact.sending') : t('contact.send')}
              </Button>
            </form>
          </section>

          <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-sm animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />
            <Image
              src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200&h=1400&fit=crop"
              alt="Support team"
              fill
              className="object-cover"
            />
            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-end p-8 text-white sm:p-10">
              <div className="max-w-md rounded-[1.75rem] bg-black/45 p-6 backdrop-blur-sm">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-white/70">
                  We Reply Fast
                </p>
                <h2 className="mb-4 text-3xl font-bold leading-tight">
                  Real help from a team that cares about every order.
                </h2>
                <p className="mb-6 text-white/80">
                  Reach us for product questions, delivery updates, returns, or anything else before and after checkout.
                </p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-white/80" />
                    <span>support@store.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneCall className="h-4 w-4 text-white/80" />
                    <span>1-800-STORE-1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquareText className="h-4 w-4 text-white/80" />
                    <span>{t('contact.info.hoursValue')}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

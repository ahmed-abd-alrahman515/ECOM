'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n-provider';

export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const summary = useCartStore((state) => state.summary);
  const { t } = useI18n();

  const subtotal = summary.subtotal;
  const shipping = summary.shipping;
  const tax = summary.tax;
  const total = summary.total;

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary rounded-lg p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <h2 className="text-lg font-bold text-foreground">{t('order.summary')}</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground/70">{t('order.subtotal')}</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">{t('order.shipping')}</span>
          <span className="font-medium">
            {shipping === 0 ? t('order.free') : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground/70">{t('order.tax')}</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-foreground">{t('order.total')}</span>
          <span className="text-xl font-bold text-accent">
            ${total.toFixed(2)}
          </span>
        </div>

        <Button asChild className="w-full">
          <Link href="/checkout">{t('order.proceedCheckout')}</Link>
        </Button>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Header } from '@/components/header';
import { CartSummary } from '@/components/cart-summary';
import { EmptyState } from '@/components/empty-state';
import { CartSkeleton } from '@/components/loading/cart-skeleton';
import { useCartStore } from '@/lib/store';
import { useI18n } from '@/components/i18n-provider';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const { t } = useI18n();

  const handleRemoveItem = async (productId: string, variantId?: string, size?: string, color?: string) => {
    try {
      await removeFromCart({ product_id: productId, variant_id: variantId, size, color });
      toast.success('Cart updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update cart');
    }
  };

  const handleIncrease = async (productId: string, variantId?: string, size?: string, color?: string) => {
    try {
      await addToCart({ product_id: productId, variant_id: variantId, quantity: 1, size, color });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update cart');
    }
  };

  const handleDecrease = async (productId: string, variantId?: string, size?: string, color?: string) => {
    try {
      await removeFromCart({ product_id: productId, variant_id: variantId, quantity: 1, size, color });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update cart');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t('cart.title')}</h1>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CartSkeleton />
            </div>
            <div className="rounded-2xl bg-secondary/50 p-6 animate-pulse">
              <div className="h-6 w-32 rounded bg-secondary/70" />
              <div className="mt-6 space-y-3">
                <div className="h-4 rounded bg-secondary/70" />
                <div className="h-4 rounded bg-secondary/70" />
                <div className="h-4 rounded bg-secondary/70" />
              </div>
              <div className="mt-8 h-10 rounded bg-secondary/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <h1 className="text-3xl font-bold text-foreground mb-8">{t('cart.title')}</h1>
          <EmptyState
            title={error ?? t('cart.empty')}
            actionLabel={t('cart.continueShopping')}
            actionHref="/products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="mb-8">
          <Link href="/products" className="flex items-center gap-2 text-accent hover:text-accent/80 mb-4">
            <ChevronLeft size={16} />
            {t('cart.continueShopping')}
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{t('cart.title')}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 bg-card border border-border rounded-lg p-4"
              >
                <div className="relative w-24 h-24 flex-shrink-0 bg-secondary rounded-lg overflow-hidden">
                  {item.main_image_url ? (
                    <Image
                      src={item.main_image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary/70" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-semibold text-foreground hover:text-accent truncate">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-foreground mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                  {item.size || item.color ? (
                    <p className="mt-1 text-sm text-foreground/70">
                      {[item.size, item.color].filter(Boolean).join(' / ')}
                    </p>
                  ) : null}

                  <div className="flex items-center gap-2 mt-2 bg-secondary rounded-lg w-fit">
                    <button
                      onClick={() => void handleDecrease(item.product_id, item.variant_id, item.size, item.color)}
                      className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-border"
                      disabled={item.quantity <= 1 || isLoading}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => void handleIncrease(item.product_id, item.variant_id, item.size, item.color)}
                      className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-border"
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => void handleRemoveItem(item.product_id, item.variant_id, item.size, item.color)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded transition"
                    disabled={isLoading}
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="text-right">
                    <p className="text-sm text-foreground/70">{t('cart.subtotal')}</p>
                    <p className="text-lg font-bold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

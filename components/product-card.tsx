'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore, useWishlistStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/i18n-provider';
import type { Product } from '@/lib/types/api';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const { t } = useI18n();
  const router = useRouter();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.info(t('reviews.loginRequired'));
      router.push('/auth/login');
      return;
    }

    const inStockVariants = product.variants.filter((variant) => variant.stock > 0);
    const selectedVariant = inStockVariants[0];

    if (product.variants.length > 0 && inStockVariants.length !== 1) {
      toast.info('Please choose size and color first');
      router.push(`/product/${product.slug}`);
      return;
    }

    setIsAdding(true);

    try {
      await addToCart({
        product_id: product.id,
        variant_id: selectedVariant?.id,
        quantity: 1,
        size: selectedVariant?.size,
        color: selectedVariant?.color,
      });
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add product to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.info(t('reviews.loginRequired'));
      router.push('/auth/login');
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        toast.info('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist');
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="block h-full">
      <article className="group h-full cursor-pointer animate-in fade-in zoom-in duration-500">
        <div className="hover-lift glass-panel h-full overflow-hidden rounded-[1.95rem] border border-border/60">
          <div className="relative h-64 overflow-hidden bg-secondary/40 sm:h-72">
            {product.main_image_url ? (
              <Image
                src={product.main_image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full bg-secondary/70" />
            )}
            {product.originalPrice && (
              <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold text-foreground shadow-sm backdrop-blur">
                {t('product.sale')}
              </div>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="rounded-full bg-background/90 px-4 py-2 font-semibold text-foreground shadow-sm">
                  {t('product.outOfStock')}
                </span>
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/15 group-hover:opacity-100">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAdding}
                className="bg-background/95 shadow-lg backdrop-blur"
              >
                <ShoppingCart size={20} />
              </Button>
              <Button
                variant={isInWishlist ? 'default' : 'secondary'}
                size="icon"
                onClick={handleWishlistToggle}
                className={isInWishlist ? '' : 'bg-background/95 backdrop-blur'}
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {product.category}
              </p>
              {product.variants.length > 0 ? (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                  {product.variants.length} options
                </span>
              ) : null}
            </div>

            <h3 className="font-display line-clamp-2 text-[1.35rem] font-semibold leading-snug text-foreground">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => {
                  const active = i < Math.round(product.rating);
                  return (
                    <Star
                      key={i}
                      size={14}
                      className={`transition-all duration-200 group-hover:brightness-110 ${
                        active
                          ? 'fill-yellow-400 text-yellow-400 group-hover:scale-110'
                          : 'fill-transparent text-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviews_count})
              </span>
            </div>

            <div className="flex items-end justify-between gap-3 pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className={`text-xs font-semibold ${product.inStock ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {product.inStock ? t('product.inStock') : t('product.outOfStock')}
              </span>
            </div>

            {product.variants.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                {product.variants.length} variant{product.variants.length === 1 ? '' : 's'} available
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}

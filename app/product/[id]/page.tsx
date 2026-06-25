'use client';

import { useState, useEffect, use, useMemo } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, ChevronLeft, Star, ShieldCheck, Truck, RefreshCw, Loader2, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { ProductImageGallery } from '@/components/product-image-gallery';
import { getProductBySlug } from '@/lib/api/products';
import { useCartStore, useWishlistStore, useAuthStore } from '@/lib/store';
import { useI18n } from '@/components/i18n-provider';
import { ProductReviews } from '@/components/product-reviews';
import type { Product } from '@/lib/types/api';

const colorMap: Record<string, string> = {
  black: '#111827',
  white: '#f8fafc',
  gray: '#9ca3af',
  grey: '#9ca3af',
  silver: '#cbd5e1',
  blue: '#2563eb',
  navy: '#1e3a8a',
  red: '#dc2626',
  green: '#16a34a',
  yellow: '#facc15',
  gold: '#eab308',
  purple: '#7c3aed',
  pink: '#ec4899',
  orange: '#f97316',
  brown: '#7c4a22',
  beige: '#d6c6a5',
  cream: '#f3eadb',
};

function getColorSwatch(color: string) {
  return colorMap[color.trim().toLowerCase()] ?? color;
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const { t } = useI18n();
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const wishlistLookupId = product?.id ?? id;
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(wishlistLookupId));
  const addToWishlist = useWishlistStore((state) => state.addToWishlist);
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const variants = product?.variants ?? [];
  const hasVariants = variants.length > 0;
  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.size === selectedSize && variant.color === selectedColor),
    [variants, selectedSize, selectedColor],
  );
  const availableSizes = useMemo(
    () => Array.from(new Set(variants.map((variant) => variant.size).filter(Boolean))),
    [variants],
  );
  const availableColors = useMemo(
    () => Array.from(new Set(variants.map((variant) => variant.color).filter(Boolean))),
    [variants],
  );
  const displayedStock = selectedVariant
    ? selectedVariant.stock
    : hasVariants
      ? 0
      : product?.inStock
        ? Number.MAX_SAFE_INTEGER
        : 0;
  const isSizeAvailable = (size: string) =>
    variants.some((variant) => variant.size === size && (!selectedColor || variant.color === selectedColor) && variant.stock > 0);
  const isColorAvailable = (color: string) =>
    variants.some((variant) => variant.color === color && (!selectedSize || variant.size === selectedSize) && variant.stock > 0);

  useEffect(() => {
    if (!selectedSize || !selectedColor) {
      return;
    }

    const isValidSelection = variants.some(
      (variant) => variant.size === selectedSize && variant.color === selectedColor && variant.stock > 0,
    );

    if (!isValidSelection) {
      setSelectedColor('');
    }
  }, [variants, selectedSize, selectedColor]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await getProductBySlug(id);
        setProduct(productData);
        setSelectedSize('');
        setSelectedColor('');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    void loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isLoggedIn) {
      toast.info(t('reviews.loginRequired'));
      router.push('/auth/login');
      return;
    }

    if (hasVariants && !selectedVariant) {
      toast.error('Please select a size and color');
      return;
    }

    if (selectedVariant && selectedVariant.stock <= 0) {
      toast.error('Out of stock');
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart({
        product_id: product.id,
        variant_id: selectedVariant?.id,
        quantity,
        size: selectedVariant?.size,
        color: selectedVariant?.color,
      });
      toast.success(`${quantity} x ${product.name} added to cart`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

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

  if (isLoading) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-[2.5rem] bg-secondary/30" />
            <div className="space-y-8 py-4">
              <div className="h-4 w-24 animate-pulse rounded-full bg-secondary/30" />
              <div className="h-12 w-3/4 animate-pulse rounded-2xl bg-secondary/30" />
              <div className="h-6 w-1/3 animate-pulse rounded-full bg-secondary/30" />
              <div className="h-32 w-full animate-pulse rounded-3xl bg-secondary/30" />
              <div className="h-20 w-full animate-pulse rounded-3xl bg-secondary/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl space-y-6 px-4 py-32 text-center sm:px-6 lg:px-8">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50">
            <Info size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground">{t('product.notFound')}</h1>
          <Button asChild size="lg" className="rounded-full px-10">
            <Link href="/products">{t('product.backToProducts')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const detailImageUrls = product.details?.image_urls ?? product.images;

  return (
    <div className="min-h-full bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="group mb-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-all hover:text-foreground"
        >
          <ChevronLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          {t('product.backToProducts')}
        </Link>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
          <div className="space-y-6">
            <div className="relative">
              <ProductImageGallery
                name={product.name}
                mainImageUrl={product.main_image_url}
                detailImageUrls={detailImageUrls}
              />
              {discount > 0 && (
                <div className="pointer-events-none absolute left-8 top-8 rounded-full bg-background/90 px-5 py-2 text-lg font-black text-foreground shadow-xl backdrop-blur animate-in zoom-in duration-500">
                  -{discount}%
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-5">
              <div className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.22em] text-secondary-foreground">
                {product.category}
              </div>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={22}
                      className={`animate-in zoom-in transition-all duration-300 hover:scale-110 ${
                        i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-transparent text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-base font-semibold text-foreground/70">
                  {product.rating.toFixed(1)} <span className="text-sm font-medium opacity-60">({product.reviews_count} {t('reviews.title')})</span>
                </span>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-foreground sm:text-5xl">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through decoration-primary/40 decoration-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 font-semibold text-emerald-600">
                  <Truck size={18} />
                  <span className="text-sm">{t('benefit.freeShipping')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-border/60 bg-card p-8 shadow-sm">
              <h3 className="text-lg font-semibold uppercase tracking-[0.22em] text-foreground">
                {t('product.description')}
              </h3>
              <p className="text-lg leading-8 text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 text-foreground/80 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Truck size={20} />
                </div>
                <span className="font-bold">{t('product.features.delivery')}</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <RefreshCw size={20} />
                </div>
                <span className="font-bold">{t('product.features.returns')}</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-bold">{t('product.features.secure')}</span>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-sm">
                <div className={`h-4 w-4 rounded-full ${(hasVariants ? displayedStock > 0 : product.inStock) ? 'bg-accent animate-pulse' : 'bg-destructive'}`} />
                <span className="text-base font-semibold">
                  {hasVariants
                    ? selectedVariant
                      ? displayedStock > 0
                        ? `${displayedStock} in stock`
                        : t('product.outOfStock')
                      : 'Select a size and color'
                    : product.inStock
                      ? t('product.inStock')
                      : t('product.outOfStock')}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {hasVariants ? (
                <div className="space-y-6 rounded-[2rem] border border-border/60 bg-card p-8 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-base font-semibold uppercase tracking-[0.22em] text-foreground">Size</h3>
                      {selectedSize ? <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground/70">{selectedSize}</span> : null}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {availableSizes.map((size) => {
                        const disabled = !isSizeAvailable(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              if (disabled) return;
                              setSelectedSize((current) => {
                                const nextSize = current === size ? '' : size;

                                if (
                                  nextSize &&
                                  selectedColor &&
                                  !variants.some(
                                    (variant) => variant.size === nextSize && variant.color === selectedColor && variant.stock > 0,
                                  )
                                ) {
                                  setSelectedColor('');
                                }

                                return nextSize;
                              });
                            }}
                            disabled={disabled}
                            className={`min-w-14 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                              selectedSize === size
                                ? 'border-primary bg-primary text-primary-foreground shadow-md'
                                : 'border-border bg-background hover:border-primary/40 hover:bg-secondary/50'
                            } ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:-translate-y-0.5'}`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-base font-semibold uppercase tracking-[0.22em] text-foreground">Color</h3>
                      {selectedColor ? <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium capitalize text-foreground/70">{selectedColor}</span> : null}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((color) => {
                        const disabled = !isColorAvailable(color);
                        const swatch = getColorSwatch(color);
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              if (disabled) return;
                              setSelectedColor((current) => {
                                const nextColor = current === color ? '' : color;

                                if (
                                  nextColor &&
                                  selectedSize &&
                                  !variants.some(
                                    (variant) => variant.color === nextColor && variant.size === selectedSize && variant.stock > 0,
                                  )
                                ) {
                                  setSelectedSize('');
                                }

                                return nextColor;
                              });
                            }}
                            disabled={disabled}
                            aria-label={`Select ${color}`}
                            title={color}
                            className={`flex min-w-[4.5rem] items-center gap-3 rounded-full border px-3 py-2.5 text-sm font-semibold capitalize transition-all ${
                              selectedColor === color
                                ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/15'
                                : 'border-border bg-background hover:border-primary/40 hover:bg-secondary/50'
                            } ${disabled ? 'cursor-not-allowed opacity-40' : 'hover:-translate-y-0.5'}`}
                          >
                            <span
                              className="h-7 w-7 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: swatch }}
                            />
                            <span>{color}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Selected Variant
                    </p>
                    <p className={`text-sm font-medium ${selectedVariant?.stock === 0 ? 'text-destructive' : 'text-foreground/70'}`}>
                      {selectedVariant
                        ? selectedVariant.stock > 0
                          ? `${selectedVariant.size} / ${selectedVariant.color} - ${selectedVariant.stock} in stock`
                          : 'Out of stock'
                        : 'Select both size and color'}
                    </p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center">
                <div className="flex items-center gap-6 rounded-2xl border border-border/60 bg-card p-2 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-2xl font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold transition-all hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                  >
                    +
                  </button>
                </div>

                <div className="flex w-full flex-1 gap-4">
                  <Button
                    size="lg"
                    className="flex-1 rounded-[1.25rem] py-8 text-lg font-bold shadow-2xl"
                    onClick={() => void handleAddToCart()}
                    disabled={isAddingToCart || !product.inStock || (hasVariants && (!selectedVariant || selectedVariant.stock <= 0))}
                  >
                    {isAddingToCart ? <Loader2 className="animate-spin" /> : <ShoppingCart size={24} className="mr-3" />}
                    {isAddingToCart ? t('product.adding') : t('product.addToCart')}
                  </Button>
                  <Button
                    size="lg"
                    variant={isInWishlist ? 'default' : 'secondary'}
                    className={`w-20 rounded-[1.25rem] py-8 shadow-xl ${
                      isInWishlist ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    onClick={() => void handleWishlistToggle()}
                  >
                    <Heart
                      size={28}
                      fill={isInWishlist ? 'currentColor' : 'none'}
                      className={isInWishlist ? 'animate-in zoom-in' : ''}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductReviews productId={product.id} />
      </main>
    </div>
  );
}

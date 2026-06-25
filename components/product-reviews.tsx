'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Loader2, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/components/i18n-provider';
import { useAuthStore } from '@/lib/store';
import { createReview, getProductReviews } from '@/lib/api/reviews';
import type { Review } from '@/lib/types/api';

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const { t } = useI18n();
  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to fetch reviews');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchReviews();
  }, [productId]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.info(t('reviews.loginRequired'));
      router.push('/auth/login');
      return;
    }

    if (rating === 0 || !comment.trim()) {
      toast.error('Please add a rating and comment');
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview = await createReview(productId, {
        rating,
        comment,
      });

      setReviews((prev) => [newReview, ...prev]);
      setRating(0);
      setComment('');
      toast.success(t('reviews.success'));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-20 border-t border-border pt-16 animate-in fade-in duration-700">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            {t('reviews.title')}
          </h2>
          <p className="text-muted-foreground">
            {reviews.length} {t('reviews.title')}
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-secondary/30 px-6 py-3">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xl font-bold text-foreground">
            {averageRating.toFixed(1)} / 5
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-foreground">
              <MessageSquare size={22} className="text-accent" />
              {t('reviews.write')}
            </h3>

            {!isLoggedIn ? (
              <div className="space-y-6 rounded-2xl border border-dashed border-border/50 bg-secondary/20 py-10 text-center">
                <p className="px-4 font-medium text-foreground/70">
                  {t('reviews.loginRequired')}
                </p>
                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="default"
                  className="rounded-full px-8 py-6 text-lg font-bold shadow-lg"
                >
                  {t('auth.login.button')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-foreground">
                    {t('reviews.rating')}
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="group rounded-full p-1 transition-all hover:scale-110 focus:outline-none"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          size={32}
                          className={`transition-all duration-200 ${
                            (hoverRating || rating) >= star
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-transparent text-gray-300 group-hover:text-yellow-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-foreground">
                    {t('reviews.comment')}
                  </label>
                  <Textarea
                    placeholder={t('reviews.placeholder')}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[180px] resize-none rounded-2xl border-border/50 bg-background p-6 text-lg focus:border-ring focus:ring-ring/20"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-2xl py-8 text-xl font-bold shadow-xl"
                  disabled={isSubmitting || rating === 0}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-3 animate-spin" size={24} />
                  ) : (
                    <Send size={24} className="mr-3" />
                  )}
                  {t('reviews.submit')}
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-8 lg:col-span-7">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 w-full animate-pulse rounded-3xl bg-secondary/30" />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 rounded-[2.5rem] border border-dashed border-border bg-secondary/10 py-24 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50">
                <MessageSquare size={40} className="text-muted-foreground/50" />
              </div>
              <p className="mx-auto max-w-xs text-lg font-medium text-foreground/60">
                {t('reviews.empty')}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="group animate-in fade-in slide-in-from-bottom-4 rounded-[2rem] border border-border/50 bg-card p-8 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
                        <UserCircle size={32} />
                      </div>
                      <div>
                        <h4 className="mb-1 text-xl font-bold text-foreground">
                          {review.user_name}
                        </h4>
                        <span className="text-sm font-medium text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex rounded-full border border-border/70 bg-secondary/60 px-3 py-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-transparent text-gray-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-lg italic leading-relaxed text-foreground/80">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

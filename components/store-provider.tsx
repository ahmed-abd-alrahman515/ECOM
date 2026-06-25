'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { useCartStore } from '@/lib/stores/useCartStore';
import { useWishlistStore } from '@/lib/stores/useWishlistStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const clearAuthState = useAuthStore((state) => state.clearAuthState);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      try {
        await hydrateAuth();
        if (!isMounted || !useAuthStore.getState().isAuthenticated) {
          clearCart();
          clearWishlist();
          return;
        }

        await Promise.allSettled([fetchCart(), fetchWishlist()]);
      } catch {
        if (isMounted) {
          clearCart();
          clearWishlist();
        }
      }
    };

    const handleUnauthorized = () => {
      clearAuthState();
      clearCart();
      clearWishlist();
    };

    void bootstrap();
    window.addEventListener('app:unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('app:unauthorized', handleUnauthorized);
    };
  }, [hydrateAuth, fetchCart, fetchWishlist, clearAuthState, clearCart, clearWishlist]);

  return <>{children}</>;
}

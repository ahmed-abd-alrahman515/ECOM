'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2, MapPinPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import { CartSummary } from '@/components/cart-summary';
import { EmptyState } from '@/components/empty-state';
import { CartSkeleton } from '@/components/loading/cart-skeleton';
import { useCartStore, useAuthStore } from '@/lib/store';
import { createOrder } from '@/lib/api/orders';
import { createAddress, getAddresses } from '@/lib/api/addresses';
import { useI18n } from '@/components/i18n-provider';
import type { Address } from '@/lib/types/api';

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const isLoggedIn = useAuthStore((state) => state.isAuthenticated);
  const authInitialized = useAuthStore((state) => state.initialized);
  const items = useCartStore((state) => state.items);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    if (authInitialized && !isLoggedIn) {
      router.push('/auth/login');
    }
  }, [authInitialized, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const loadAddresses = async () => {
      setIsLoadingAddresses(true);

      try {
        const list = await getAddresses();
        setAddresses(list);

        const defaultAddress = list.find((address) => address.is_default) ?? list[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to load addresses');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    void loadAddresses();
  }, [isLoggedIn]);

  useEffect(() => {
    const selectedAddress = addresses.find((address) => address.id === selectedAddressId);

    if (!selectedAddress) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      address: selectedAddress.address_line_1,
      city: selectedAddress.city,
      state: selectedAddress.state,
      zip: selectedAddress.zip,
      phone: prev.phone || selectedAddress.phone || '',
    }));
  }, [addresses, selectedAddressId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`.trim();

      await createOrder({
        address_id: selectedAddressId || undefined,
        customer_name: customerName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        name: customerName,
        full_name: customerName,
        customer: {
          name: customerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setOrderPlaced(true);
      toast.success('Order placed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Order failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAddress = async () => {
    setIsSavingAddress(true);

    try {
      const customerName = `${formData.firstName} ${formData.lastName}`.trim();
      const newAddress = await createAddress({
        label: customerName ? `${customerName}'s address` : 'Shipping address',
        recipient_name: customerName || undefined,
        phone: formData.phone || undefined,
        address_line_1: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      });

      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
      toast.success('Address saved');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save address');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const canSaveAddress = Boolean(
    formData.address &&
    formData.city &&
    formData.state &&
    formData.zip &&
    formData.firstName &&
    formData.lastName,
  );

  if (!authInitialized || isCartLoading) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-10 w-48 rounded bg-secondary/70 animate-pulse" />
              <CartSkeleton />
            </div>
            <div className="rounded-2xl bg-secondary/50 p-6 animate-pulse">
              <div className="h-6 w-32 rounded bg-secondary/70" />
              <div className="mt-6 space-y-3">
                <div className="h-4 rounded bg-secondary/70" />
                <div className="h-4 rounded bg-secondary/70" />
                <div className="h-4 rounded bg-secondary/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
          <EmptyState
            title={t('checkout.emptyCart')}
            actionLabel={t('checkout.continueShopping')}
            actionHref="/products"
          />
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-full bg-background">
        <Header />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-8 text-center space-y-6">
            <div className="text-5xl">✓</div>
            <h1 className="text-3xl font-bold text-foreground">{t('checkout.orderPlaced.title')}</h1>
            <p className="text-foreground/70">{t('checkout.orderPlaced.text')}</p>
            <Button asChild className="w-full">
              <Link href="/products">{t('checkout.continueShopping')}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <Link href="/cart" className="flex items-center gap-2 text-accent hover:text-accent/80 mb-8">
          <ChevronLeft size={16} />
          {t('checkout.backToCart')}
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-foreground">Saved addresses</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewAddressForm((prev) => !prev)}
                >
                  <MapPinPlus size={16} className="mr-2" />
                  {showNewAddressForm ? 'Hide form' : 'New address'}
                </Button>
              </div>

              {isLoadingAddresses ? (
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <Loader2 size={16} className="animate-spin" />
                  Loading addresses...
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        selectedAddressId === address.id
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-accent/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">
                            {address.label ?? address.recipient_name ?? 'Saved address'}
                          </p>
                          <p className="text-sm text-foreground/70">
                            {[address.address_line_1, address.address_line_2, address.city, address.state, address.zip]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                          {address.phone ? (
                            <p className="text-sm text-foreground/70">{address.phone}</p>
                          ) : null}
                        </div>
                        {address.is_default ? (
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                            Default
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground/70">No saved addresses yet. You can still checkout with the form below.</p>
              )}
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">{t('shipping.address.title')}</h2>

              <div className="grid grid-cols-2 gap-4">
                <Input type="text" name="firstName" placeholder={t('shipping.firstName')} value={formData.firstName} onChange={handleInputChange} required />
                <Input type="text" name="lastName" placeholder={t('shipping.lastName')} value={formData.lastName} onChange={handleInputChange} required />
              </div>

              <Input type="email" name="email" placeholder={t('shipping.email')} value={formData.email} onChange={handleInputChange} required />
              <Input type="tel" name="phone" placeholder={t('shipping.phone')} value={formData.phone} onChange={handleInputChange} required />
              <Input type="text" name="address" placeholder={t('shipping.street')} value={formData.address} onChange={handleInputChange} required />

              <div className="grid grid-cols-3 gap-4">
                <Input type="text" name="city" placeholder={t('shipping.city')} value={formData.city} onChange={handleInputChange} required />
                <Input type="text" name="state" placeholder={t('shipping.state')} value={formData.state} onChange={handleInputChange} required />
                <Input type="text" name="zip" placeholder={t('shipping.zip')} value={formData.zip} onChange={handleInputChange} required />
              </div>

              {showNewAddressForm ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void handleCreateAddress()}
                  disabled={isSavingAddress || !canSaveAddress}
                >
                  {isSavingAddress ? 'Saving address...' : 'Save this address'}
                </Button>
              ) : null}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isProcessing}
            >
              {isProcessing ? t('order.processing') : t('order.place')}
            </Button>
          </form>

          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

import axios from 'axios';
import type {
  Address,
  AuthResponse,
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  Product,
  ProductDetails,
  ProductVariant,
  Review,
  User,
} from '@/lib/types/api';

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function extractData<T>(payload: unknown): T {
  if (!isObject(payload)) {
    return payload as T;
  }

  if (Array.isArray(payload.data)) {
    return payload.data as T;
  }

  if (isObject(payload.data) && ('data' in payload.data || Object.keys(payload).every((key) => ['data', 'meta', 'links', 'message'].includes(key)))) {
    return extractData<T>(payload.data);
  }

  if ('data' in payload && !('id' in payload) && !('items' in payload)) {
    return payload.data as T;
  }

  return payload as T;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as Record<string, any> | undefined;
    const message =
      responseData?.message ||
      responseData?.error ||
      (Array.isArray(responseData?.errors)
        ? responseData?.errors[0]
        : undefined) ||
      (isObject(responseData?.errors)
        ? Object.values(responseData.errors)[0]
        : undefined);

    if (Array.isArray(message)) {
      return String(message[0] ?? fallbackMessage);
    }

    if (message) {
      return String(message);
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function handleApiError(error: unknown, fallbackMessage: string): never {
  throw new Error(getErrorMessage(error, fallbackMessage));
}

export function resolveImageUrl(value: unknown) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
    return value;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const origin = apiUrl.replace(/\/api\/?$/, '');

  return origin ? `${origin}/${value.replace(/^\/+/, '')}` : `/${value.replace(/^\/+/, '')}`;
}

export function normalizeUser(raw: Record<string, any>): User {
  return {
    id: String(raw.id ?? raw.uuid ?? raw.user_id ?? ''),
    name: String(raw.name ?? raw.full_name ?? raw.username ?? ''),
    email: String(raw.email ?? ''),
  };
}

export function normalizeCategory(raw: Record<string, any>): Category {
  return {
    id: String(raw.id ?? raw.slug ?? raw.name ?? ''),
    name: String(raw.name ?? raw.title ?? ''),
    slug: String(raw.slug ?? raw.id ?? raw.name ?? ''),
    image: resolveImageUrl(
      raw.main_image_url ??
      raw.image_url ??
      raw.image ??
      raw.photo ??
      raw.icon ??
      raw.thumbnail,
    ),
  };
}

export function normalizeProduct(raw: Record<string, any>): Product {
  const mainImageUrl = resolveImageUrl(
    raw.main_image_url ?? raw.mainImageUrl ?? raw.image_url ?? raw.image,
  );
  const detailsImageUrls = Array.isArray(raw.details?.image_urls)
    ? raw.details.image_urls
        .map((image: unknown) => resolveImageUrl(image))
        .filter(Boolean)
    : [];

  const rawImages = Array.isArray(raw.images)
    ? raw.images
    : Array.isArray(raw.gallery_images)
      ? raw.gallery_images
      : [];

  const images = rawImages
    .map((image) => {
      if (typeof image === 'string') {
        return resolveImageUrl(image);
      }

      if (isObject(image)) {
        return resolveImageUrl(image.url ?? image.path ?? image.image ?? image.main_image_url);
      }

      return null;
    })
    .filter(Boolean) as string[];
  const details: ProductDetails | undefined = detailsImageUrls.length > 0
    ? {
        image_urls: detailsImageUrls,
      }
    : undefined;

  const originalPrice = toOptionalNumber(
    raw.original_price ?? raw.originalPrice ?? raw.compare_at_price ?? raw.regular_price,
  );
  const price = toOptionalNumber(raw.price ?? raw.sale_price ?? raw.final_price) ?? 0;
  const variants = Array.isArray(raw.variants)
    ? raw.variants.map((variant) => normalizeProductVariant(variant)).filter((variant) => variant.id)
    : [];

  return {
    id: String(raw.id ?? raw.slug ?? ''),
    slug: String(raw.slug ?? raw.id ?? ''),
    name: String(raw.name ?? raw.title ?? ''),
    description: String(raw.description ?? raw.short_description ?? ''),
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    main_image_url: mainImageUrl,
    images: images.length > 0 ? images : mainImageUrl ? [mainImageUrl] : [],
    details,
    category: String(raw.category?.name ?? raw.category_name ?? raw.category ?? ''),
    inStock: Boolean(
      raw.in_stock ??
      raw.is_in_stock ??
      (variants.length > 0
        ? variants.some((variant) => variant.stock > 0)
        : (Number(raw.stock ?? raw.quantity ?? 1) > 0)),
    ),
    rating: Number(raw.rating_average ?? raw.avg_rating ?? raw.rating ?? 0),
    reviews_count: Number(raw.reviews_count ?? raw.reviewsCount ?? raw.reviews?.length ?? 0),
    variants,
  };
}

export function normalizeProductVariant(raw: Record<string, any>): ProductVariant {
  return {
    id: String(raw.id ?? raw.variant_id ?? raw.sku ?? ''),
    size: String(raw.size ?? raw.option_size ?? raw.size_name ?? ''),
    color: String(raw.color ?? raw.option_color ?? raw.color_name ?? ''),
    stock: Number(raw.stock ?? raw.quantity ?? raw.inventory ?? 0),
  };
}

export function normalizeReview(raw: Record<string, any>): Review {
  return {
    id: String(raw.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)),
    user_name: String(raw.user_name ?? raw.user?.name ?? raw.author?.name ?? ''),
    rating: Number(raw.rating ?? 0),
    comment: String(raw.comment ?? raw.review ?? ''),
    created_at: String(raw.created_at ?? new Date().toISOString()),
  };
}

export function normalizeCartItem(raw: Record<string, any>): CartItem {
  const product = isObject(raw.product) ? raw.product : raw;
  const normalizedProduct = normalizeProduct(product);
  const variant = isObject(raw.variant)
    ? normalizeProductVariant(raw.variant)
    : isObject(raw.product_variant)
      ? normalizeProductVariant(raw.product_variant)
      : null;
  const variantSize = String(
    raw.size ??
    raw.variant_size ??
    variant?.size ??
    '',
  ) || undefined;
  const variantColor = String(
    raw.color ??
    raw.variant_color ??
    variant?.color ??
    '',
  ) || undefined;
  const variantId = raw.variant_id || variant?.id ? String(raw.variant_id ?? variant?.id) : undefined;
  const cartItemId = variantId
    ?? (raw.id ? String(raw.id) : undefined)
    ?? String(raw.product_id ?? normalizedProduct.id);

  return {
    id: cartItemId,
    product_id: String(raw.product_id ?? normalizedProduct.id),
    variant_id: variantId,
    slug: normalizedProduct.slug,
    name: normalizedProduct.name,
    price: Number(raw.price ?? normalizedProduct.price),
    quantity: Number(raw.quantity ?? raw.qty ?? 1),
    main_image_url: normalizedProduct.main_image_url,
    size: variantSize,
    color: variantColor,
  };
}

export function normalizeCart(raw: Record<string, any>): Cart {
  const rawItems = Array.isArray(raw.items)
    ? raw.items
    : Array.isArray(raw.cart_items)
      ? raw.cart_items
      : Array.isArray(raw)
        ? raw
        : [];
  const items = rawItems.map((item) => normalizeCartItem(item));
  const subtotal = Number(raw.subtotal ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const shipping = Number(raw.shipping ?? raw.shipping_total ?? (subtotal > 100 ? 0 : 10));
  const tax = Number(raw.tax ?? raw.tax_total ?? subtotal * 0.1);

  return {
    items,
    subtotal,
    shipping,
    tax,
    total: Number(raw.total ?? subtotal + shipping + tax),
  };
}

export function normalizeOrderItem(raw: Record<string, any>): OrderItem {
  const cartItem = normalizeCartItem(raw);

  return {
    id: cartItem.id,
    product_id: cartItem.product_id,
    variant_id: cartItem.variant_id,
    name: cartItem.name,
    quantity: cartItem.quantity,
    price: cartItem.price,
    main_image_url: cartItem.main_image_url,
    size: cartItem.size,
    color: cartItem.color,
  };
}

export function normalizeOrder(raw: Record<string, any>): Order {
  const items = Array.isArray(raw.items) ? raw.items.map((item) => normalizeOrderItem(item)) : [];

  return {
    id: String(raw.id ?? raw.order_number ?? ''),
    status: String(raw.status ?? 'pending'),
    total: Number(raw.total ?? 0),
    created_at: String(raw.created_at ?? new Date().toISOString()),
    items,
  };
}

export function normalizeAuthResponse(raw: Record<string, any>): AuthResponse {
  const payload = extractData<Record<string, any>>(raw);
  const userPayload = payload.user ?? payload;
  const token = String(payload.token ?? payload.access_token ?? payload.accessToken ?? '');

  return {
    token,
    user: normalizeUser(userPayload),
  };
}

export function normalizeAddress(raw: Record<string, any>): Address {
  return {
    id: String(raw.id ?? raw.address_id ?? raw.uuid ?? ''),
    label: raw.label ? String(raw.label) : undefined,
    recipient_name: raw.recipient_name ? String(raw.recipient_name) : raw.name ? String(raw.name) : undefined,
    phone: raw.phone ? String(raw.phone) : undefined,
    address_line_1: String(raw.address_line_1 ?? raw.address ?? raw.street ?? ''),
    address_line_2: raw.address_line_2 ? String(raw.address_line_2) : undefined,
    city: String(raw.city ?? ''),
    state: String(raw.state ?? raw.region ?? ''),
    zip: String(raw.zip ?? raw.postal_code ?? ''),
    country: raw.country ? String(raw.country) : undefined,
    is_default: Boolean(raw.is_default ?? raw.default ?? false),
  };
}

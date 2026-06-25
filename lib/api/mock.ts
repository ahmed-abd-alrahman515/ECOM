import type {
  Address,
  AuthResponse,
  Cart,
  CartItem,
  Category,
  CreateAddressPayload,
  CreateOrderPayload,
  LoginPayload,
  Order,
  Product,
  ProductFilters,
  RegisterPayload,
  Review,
  ReviewPayload,
  User,
} from '@/lib/types/api';
import type { ContactPayload, ForgotPasswordPayload, ResetPasswordPayload } from '@/lib/api/support';

const categories: Category[] = [
  { id: 'cat-1', name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1200&fit=crop' },
  { id: 'cat-2', name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=1200&fit=crop' },
  { id: 'cat-3', name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1200&fit=crop' },
  { id: 'cat-4', name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1200&fit=crop' },
];

const products: Product[] = [
  {
    id: 'prod-1',
    slug: 'urban-overshirt',
    name: 'Urban Overshirt',
    description: 'A soft structured overshirt designed for daily wear with a clean city look.',
    price: 89,
    originalPrice: 119,
    main_image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Men',
    inStock: true,
    rating: 4.7,
    reviews_count: 18,
    variants: [
      { id: 'var-1', size: 'S', color: 'navy', stock: 4 },
      { id: 'var-2', size: 'M', color: 'navy', stock: 7 },
      { id: 'var-3', size: 'L', color: 'black', stock: 5 },
    ],
  },
  {
    id: 'prod-2',
    slug: 'linen-weekend-dress',
    name: 'Linen Weekend Dress',
    description: 'Lightweight linen blend dress with an easy silhouette for warm days.',
    price: 96,
    originalPrice: 129,
    main_image_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Women',
    inStock: true,
    rating: 4.8,
    reviews_count: 24,
    variants: [
      { id: 'var-4', size: 'S', color: 'cream', stock: 6 },
      { id: 'var-5', size: 'M', color: 'cream', stock: 3 },
      { id: 'var-6', size: 'L', color: 'green', stock: 2 },
    ],
  },
  {
    id: 'prod-3',
    slug: 'signature-leather-tote',
    name: 'Signature Leather Tote',
    description: 'Spacious everyday tote with a polished finish and organized interior.',
    price: 145,
    main_image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Accessories',
    inStock: true,
    rating: 4.5,
    reviews_count: 12,
    variants: [],
  },
  {
    id: 'prod-4',
    slug: 'court-sneakers',
    name: 'Court Sneakers',
    description: 'Minimal sneakers with cushioned comfort and clean lines for all-day wear.',
    price: 110,
    originalPrice: 140,
    main_image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Shoes',
    inStock: true,
    rating: 4.6,
    reviews_count: 31,
    variants: [
      { id: 'var-7', size: '41', color: 'white', stock: 4 },
      { id: 'var-8', size: '42', color: 'white', stock: 1 },
      { id: 'var-9', size: '43', color: 'black', stock: 0 },
    ],
  },
  {
    id: 'prod-5',
    slug: 'tailored-wool-coat',
    name: 'Tailored Wool Coat',
    description: 'Sharp outerwear layer with a modern cut and premium wool feel.',
    price: 189,
    originalPrice: 229,
    main_image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Women',
    inStock: true,
    rating: 4.9,
    reviews_count: 16,
    variants: [
      { id: 'var-10', size: 'S', color: 'camel', stock: 0 },
      { id: 'var-11', size: 'M', color: 'camel', stock: 5 },
      { id: 'var-12', size: 'L', color: 'black', stock: 3 },
    ],
  },
  {
    id: 'prod-6',
    slug: 'classic-chronograph-watch',
    name: 'Classic Chronograph Watch',
    description: 'A refined metal watch that adds polish to both casual and dress looks.',
    price: 159,
    main_image_url: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Accessories',
    inStock: true,
    rating: 4.4,
    reviews_count: 9,
    variants: [],
  },
  {
    id: 'prod-7',
    slug: 'relaxed-tee-pack',
    name: 'Relaxed Tee Pack',
    description: 'Two ultra-soft essentials with a modern relaxed fit and breathable cotton.',
    price: 49,
    main_image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Men',
    inStock: true,
    rating: 4.3,
    reviews_count: 14,
    variants: [
      { id: 'var-13', size: 'M', color: 'white', stock: 8 },
      { id: 'var-14', size: 'L', color: 'black', stock: 5 },
    ],
  },
  {
    id: 'prod-8',
    slug: 'limited-run-boots',
    name: 'Limited Run Boots',
    description: 'Statement boots with sturdy grip and premium finish for cooler seasons.',
    price: 210,
    originalPrice: 249,
    main_image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=1400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=1400&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1400&fit=crop',
    ],
    details: {
      image_urls: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&h=1400&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=1400&fit=crop',
      ],
    },
    category: 'Shoes',
    inStock: false,
    rating: 4.2,
    reviews_count: 7,
    variants: [
      { id: 'var-15', size: '41', color: 'brown', stock: 0 },
      { id: 'var-16', size: '42', color: 'brown', stock: 0 },
    ],
  },
];

const initialReviews: Record<string, Review[]> = {
  'prod-1': [
    { id: 'rev-1', user_name: 'Maya', rating: 5, comment: 'Great fit and nice fabric.', created_at: '2026-05-16T10:00:00.000Z' },
    { id: 'rev-2', user_name: 'Omar', rating: 4, comment: 'Looks premium and feels comfortable.', created_at: '2026-05-20T12:30:00.000Z' },
  ],
  'prod-2': [
    { id: 'rev-3', user_name: 'Sara', rating: 5, comment: 'Perfect for summer and very flattering.', created_at: '2026-05-08T09:00:00.000Z' },
  ],
  'prod-4': [
    { id: 'rev-4', user_name: 'Noah', rating: 5, comment: 'Comfortable from the first wear.', created_at: '2026-05-25T15:15:00.000Z' },
  ],
};

const initialAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    recipient_name: 'Demo Shopper',
    phone: '+1 555 0147',
    address_line_1: '245 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'USA',
    is_default: true,
  },
];

const initialUser: User = {
  id: 'user-demo',
  name: 'Demo Shopper',
  email: 'demo@storefront.dev',
};

const storageKeys = {
  user: 'mock-user',
  wishlist: 'mock-wishlist',
  cart: 'mock-cart',
  addresses: 'mock-addresses',
  reviews: 'mock-reviews',
  orders: 'mock-orders',
};

const memoryStore = new Map<string, string>();

function delay(ms = 150) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }

  return {
    getItem: (key: string) => memoryStore.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memoryStore.set(key, value);
    },
    removeItem: (key: string) => {
      memoryStore.delete(key);
    },
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readStored<T>(key: string, fallback: T): T {
  const storage = getStorage();
  const raw = storage.getItem(key);

  if (!raw) {
    return clone(fallback);
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return clone(fallback);
  }
}

function writeStored<T>(key: string, value: T) {
  getStorage().setItem(key, JSON.stringify(value));
}

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCurrentUser() {
  return readStored<User | null>(storageKeys.user, null);
}

function getStoredWishlistIds() {
  return readStored<string[]>(storageKeys.wishlist, ['prod-2', 'prod-4']);
}

function getStoredAddresses() {
  return readStored<Address[]>(storageKeys.addresses, initialAddresses);
}

function getStoredReviews() {
  return readStored<Record<string, Review[]>>(storageKeys.reviews, initialReviews);
}

function getStoredOrders() {
  return readStored<Order[]>(storageKeys.orders, []);
}

function getStoredCartItems() {
  return readStored<CartItem[]>(storageKeys.cart, []);
}

function buildCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + shipping + tax).toFixed(2));

  return {
    items,
    subtotal: Number(subtotal.toFixed(2)),
    shipping,
    tax,
    total,
  };
}

function getProductById(productId: string) {
  return products.find((product) => product.id === productId);
}

function resolveCategorySlug(categoryName: string) {
  return categories.find((category) => category.name === categoryName)?.slug ?? categoryName.toLowerCase();
}

export async function getMockProducts(filters?: ProductFilters): Promise<Product[]> {
  await delay();

  let filtered = [...products];

  if (filters?.priceRange) {
    filtered = filtered.filter((product) => product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1]);
  }

  if (filters?.category?.length) {
    const selected = new Set(filters.category.map((item) => item.toLowerCase()));
    filtered = filtered.filter((product) => {
      const categorySlug = resolveCategorySlug(product.category).toLowerCase();
      return selected.has(categorySlug) || selected.has(product.category.toLowerCase());
    });
  }

  if (filters?.inStock) {
    filtered = filtered.filter((product) => product.inStock);
  }

  return clone(filtered);
}

export async function getMockProductBySlug(slug: string): Promise<Product> {
  await delay();
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    throw new Error('Product not found.');
  }

  return clone(product);
}

export async function getMockCategories(): Promise<Category[]> {
  await delay();
  return clone(categories);
}

export async function mockLogin(payload: LoginPayload): Promise<AuthResponse> {
  await delay();
  const user: User = {
    ...initialUser,
    name: payload.email === initialUser.email ? initialUser.name : payload.email.split('@')[0],
    email: payload.email,
  };

  writeStored(storageKeys.user, user);

  return {
    token: 'demo-token',
    user,
  };
}

export async function mockRegister(payload: RegisterPayload): Promise<AuthResponse> {
  await delay();
  const user: User = {
    id: createId('user'),
    name: payload.name,
    email: payload.email,
  };

  writeStored(storageKeys.user, user);

  return {
    token: 'demo-token',
    user,
  };
}

export async function mockLogout(): Promise<void> {
  await delay(80);
  getStorage().removeItem(storageKeys.user);
}

export async function mockGetMe(): Promise<User> {
  await delay(80);
  const user = getCurrentUser();

  if (!user) {
    throw new Error('Please login to continue.');
  }

  return clone(user);
}

export async function getMockCart(): Promise<Cart> {
  await delay();
  return buildCart(getStoredCartItems());
}

export async function addMockToCart(payload: { product_id: string; variant_id?: string; quantity?: number; size?: string; color?: string }): Promise<Cart> {
  await delay();
  const product = getProductById(payload.product_id);

  if (!product) {
    throw new Error('Product not found.');
  }

  const quantity = Math.max(1, payload.quantity ?? 1);
  const variant = payload.variant_id ? product.variants.find((item) => item.id === payload.variant_id) : undefined;
  const nextItems = [...getStoredCartItems()];
  const existingIndex = nextItems.findIndex((item) => (
    item.product_id === payload.product_id &&
    (item.variant_id ?? '') === (variant?.id ?? payload.variant_id ?? '')
  ));

  if (existingIndex >= 0) {
    nextItems[existingIndex] = {
      ...nextItems[existingIndex],
      quantity: nextItems[existingIndex].quantity + quantity,
    };
  } else {
    nextItems.push({
      id: variant?.id ?? createId('cart-item'),
      product_id: product.id,
      variant_id: variant?.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity,
      main_image_url: product.main_image_url,
      size: variant?.size ?? payload.size,
      color: variant?.color ?? payload.color,
    });
  }

  writeStored(storageKeys.cart, nextItems);
  return buildCart(nextItems);
}

export async function removeMockFromCart(payload: { product_id: string; variant_id?: string; quantity?: number }): Promise<Cart> {
  await delay();
  const quantity = Math.max(1, payload.quantity ?? 1);
  const nextItems = [...getStoredCartItems()];
  const existingIndex = nextItems.findIndex((item) => (
    item.product_id === payload.product_id &&
    (item.variant_id ?? '') === (payload.variant_id ?? '')
  ));

  if (existingIndex === -1) {
    return buildCart(nextItems);
  }

  const existingItem = nextItems[existingIndex];

  if ((payload.quantity ?? 0) === 0 || existingItem.quantity <= quantity) {
    nextItems.splice(existingIndex, 1);
  } else {
    nextItems[existingIndex] = {
      ...existingItem,
      quantity: existingItem.quantity - quantity,
    };
  }

  writeStored(storageKeys.cart, nextItems);
  return buildCart(nextItems);
}

export async function getMockWishlist(): Promise<Product[]> {
  await delay();
  const ids = new Set(getStoredWishlistIds());
  return clone(products.filter((product) => ids.has(product.id)));
}

export async function addMockToWishlist(productId: string): Promise<Product[]> {
  await delay();
  const ids = getStoredWishlistIds();

  if (!ids.includes(productId)) {
    ids.push(productId);
    writeStored(storageKeys.wishlist, ids);
  }

  return getMockWishlist();
}

export async function removeMockFromWishlist(productId: string): Promise<Product[]> {
  await delay();
  const ids = getStoredWishlistIds().filter((id) => id !== productId);
  writeStored(storageKeys.wishlist, ids);
  return getMockWishlist();
}

export async function getMockAddresses(): Promise<Address[]> {
  await delay();
  return clone(getStoredAddresses());
}

export async function createMockAddress(payload: CreateAddressPayload): Promise<Address> {
  await delay();
  const addresses = getStoredAddresses().map((address) => ({
    ...address,
    is_default: payload.is_default ? false : address.is_default,
  }));

  const address: Address = {
    id: createId('addr'),
    label: payload.label,
    recipient_name: payload.recipient_name,
    phone: payload.phone,
    address_line_1: payload.address_line_1,
    address_line_2: payload.address_line_2,
    city: payload.city,
    state: payload.state,
    zip: payload.zip,
    country: payload.country ?? 'USA',
    is_default: payload.is_default ?? addresses.length === 0,
  };

  const nextAddresses = [address, ...addresses];
  writeStored(storageKeys.addresses, nextAddresses);
  return clone(address);
}

export async function createMockOrder(payload: CreateOrderPayload): Promise<Order> {
  await delay(250);
  const orderItems = payload.items.map((item) => {
    const product = getProductById(item.product_id);
    const variant = product?.variants.find((entry) => entry.id === item.variant_id);

    if (!product) {
      throw new Error('Unable to create this demo order.');
    }

    return {
      id: createId('order-item'),
      product_id: product.id,
      variant_id: variant?.id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      main_image_url: product.main_image_url,
      size: variant?.size,
      color: variant?.color,
    };
  });

  const total = Number(orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));
  const order: Order = {
    id: createId('order'),
    status: 'confirmed',
    total,
    created_at: new Date().toISOString(),
    items: orderItems,
  };

  const orders = [order, ...getStoredOrders()];
  writeStored(storageKeys.orders, orders);
  writeStored(storageKeys.cart, []);

  return clone(order);
}

export async function getMockOrders(): Promise<Order[]> {
  await delay();
  return clone(getStoredOrders());
}

export async function getMockOrderById(orderId: string): Promise<Order> {
  await delay();
  const order = getStoredOrders().find((item) => item.id === orderId);

  if (!order) {
    throw new Error('Order not found.');
  }

  return clone(order);
}

export async function getMockProductReviews(productId: string): Promise<Review[]> {
  await delay();
  return clone(getStoredReviews()[productId] ?? []);
}

export async function createMockReview(productId: string, payload: ReviewPayload): Promise<Review> {
  await delay();
  const user = getCurrentUser();
  const reviews = getStoredReviews();
  const review: Review = {
    id: createId('review'),
    user_name: user?.name ?? 'Guest Reviewer',
    rating: payload.rating,
    comment: payload.comment,
    created_at: new Date().toISOString(),
  };

  reviews[productId] = [review, ...(reviews[productId] ?? [])];
  writeStored(storageKeys.reviews, reviews);

  return clone(review);
}

export async function mockSubmitContact(_payload: ContactPayload): Promise<void> {
  await delay();
}

export async function mockForgotPassword(_payload: ForgotPasswordPayload): Promise<void> {
  await delay();
}

export async function mockResetPassword(_payload: ResetPasswordPayload): Promise<void> {
  await delay();
}

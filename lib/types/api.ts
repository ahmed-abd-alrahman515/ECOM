export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductDetails {
  image_urls: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  main_image_url: string;
  images: string[];
  details?: ProductDetails;
  category: string;
  inStock: boolean;
  rating: number;
  reviews_count: number;
  variants: ProductVariant[];
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id?: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  main_image_url: string;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id?: string;
  name: string;
  quantity: number;
  price: number;
  main_image_url: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export interface Address {
  id: string;
  label?: string;
  recipient_name?: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  is_default?: boolean;
}

export interface ProductFilters {
  priceRange?: [number, number];
  category?: string[];
  inStock?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CartMutationPayload {
  product_id: string;
  variant_id?: string;
  quantity?: number;
  size?: string;
  color?: string;
}

export interface ReviewPayload {
  rating: number;
  comment: string;
}

export interface CreateOrderPayload {
  address_id?: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  name?: string;
  full_name?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  items: Array<{
    product_id: string;
    variant_id?: string;
    quantity: number;
  }>;
}

export interface CreateAddressPayload {
  label?: string;
  recipient_name?: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  is_default?: boolean;
}

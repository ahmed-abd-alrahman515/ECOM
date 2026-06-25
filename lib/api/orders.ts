import { createMockOrder, getMockOrderById, getMockOrders } from '@/lib/api/mock';
import type { CreateOrderPayload, Order } from '@/lib/types/api';

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return createMockOrder(payload);
}

export async function getOrders(): Promise<Order[]> {
  return getMockOrders();
}

export async function getOrderById(orderId: string): Promise<Order> {
  return getMockOrderById(orderId);
}

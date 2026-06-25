import { createMockAddress, getMockAddresses } from '@/lib/api/mock';
import type { Address, CreateAddressPayload } from '@/lib/types/api';

export async function getAddresses(): Promise<Address[]> {
  return getMockAddresses();
}

export async function createAddress(payload: CreateAddressPayload): Promise<Address> {
  return createMockAddress(payload);
}

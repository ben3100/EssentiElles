import { PaymentMode } from '../models/types';

export const resolvePaymentMode = (rawValue?: string | null): PaymentMode => {
  const normalized = rawValue?.trim().toLowerCase();
  return normalized === 'stripe' ? 'stripe' : 'demo';
};

export const getPaymentMode = (): PaymentMode =>
  resolvePaymentMode(process.env.EXPO_PUBLIC_PAYMENT_MODE);

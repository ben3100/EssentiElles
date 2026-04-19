import { OrderItem, PaymentResult } from '../models/types';
import { getPaymentMode } from '../constants/payment';
import { orderService } from './api';

export interface CheckoutCartPayload {
  items: OrderItem[];
  addressId: string;
  notes?: string;
}

export const STRIPE_NOT_CONFIGURED_MESSAGE = 'Stripe non configuré';

export async function checkoutCart(payload: CheckoutCartPayload): Promise<PaymentResult> {
  const paymentMode = getPaymentMode();

  if (paymentMode === 'stripe') {
    throw new Error(STRIPE_NOT_CONFIGURED_MESSAGE);
  }

  const response = await orderService.create(payload);

  return {
    paymentMode,
    order: response.data,
  };
}

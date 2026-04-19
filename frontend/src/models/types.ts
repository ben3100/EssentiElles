// Livrella — TypeScript Interfaces

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  preferences: {
    notifications: boolean;
    newsletter: boolean;
    language: 'fr' | 'en';
  };
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brand: string;
  images: string[];
  price: number;
  subscriptionPrice: number;
  discountPercentage: number;
  unit: string;
  quantity: number;
  inStock: boolean;
  stockCount: number;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  tags: string[];
  availableFrequencies: ('weekly' | 'biweekly' | 'monthly')[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: string;
  addressId: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  frequency: 'weekly' | 'biweekly' | 'monthly';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  startDate: string;
  nextDeliveryDate: string;
  lastDeliveryDate?: string;
  autoRenew: boolean;
  deliveryCount: number;
  createdAt: string;
  updatedAt: string;
  // Populated
  product?: Product;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TimelineEntry {
  status: string;
  date: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  subscriptionId?: string;
  addressId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  timeline: TimelineEntry[];
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export type PaymentMode = 'demo' | 'stripe';

export interface PaymentResult {
  paymentMode: PaymentMode;
  order: Order;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  paidAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'delivery' | 'subscription' | 'promo' | 'support' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface TicketMessage {
  sender: 'customer' | 'support';
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  messages: TicketMessage[];
  assignedTo?: string;
  resolvedAt?: string;
  satisfactionRating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  discount: number;
  badgeText?: string;
  badgeTextEn?: string;
  color: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

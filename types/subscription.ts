export type BillingCycle = 'monthly' | 'yearly' | 'weekly';

export interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: BillingCycle;
  billingDate: number; // 1-31
  category: string;
  color: string;
  icon: string;
  memo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionSummary {
  totalMonthly: number;
  totalYearly: number;
  activeCount: number;
  upcomingPayments: UpcomingPayment[];
}

export interface UpcomingPayment {
  subscription: Subscription;
  dueDate: string;
  daysUntil: number;
}

export interface CreateSubscriptionRequest {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  billingDate: number;
  category: string;
  color: string;
  icon: string;
  memo?: string;
}

export type UpdateSubscriptionRequest = Partial<CreateSubscriptionRequest> & {
  isActive?: boolean;
};

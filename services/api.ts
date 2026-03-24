import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {
  Subscription,
  SubscriptionSummary,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from '../types/subscription';
import { API_BASE_URL } from '../constants/config';

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  async getSubscriptions(): Promise<Subscription[]> {
    const res = await client.get('/api/subscriptions');
    return res.data.map(mapSubscription);
  },

  async createSubscription(req: CreateSubscriptionRequest): Promise<Subscription> {
    const res = await client.post('/api/subscriptions', {
      ...req,
      billingCycle: req.billingCycle.toUpperCase(),
    });
    return mapSubscription(res.data);
  },

  async updateSubscription(id: string, req: UpdateSubscriptionRequest): Promise<Subscription> {
    const res = await client.put(`/api/subscriptions/${id}`, {
      ...req,
      billingCycle: req.billingCycle?.toUpperCase(),
    });
    return mapSubscription(res.data);
  },

  async deleteSubscription(id: string): Promise<void> {
    await client.delete(`/api/subscriptions/${id}`);
  },

  async getSummary(): Promise<SubscriptionSummary> {
    const res = await client.get('/api/subscriptions/summary');
    const data = res.data;
    return {
      totalMonthly: data.totalMonthly,
      totalYearly: data.totalYearly,
      activeCount: data.activeCount,
      upcomingPayments: data.upcomingPayments.map((p: any) => ({
        subscription: mapSubscription(p.subscription),
        dueDate: p.dueDate,
        daysUntil: p.daysUntil,
      })),
    };
  },
};

function mapSubscription(data: any): Subscription {
  return {
    id: data.id.toString(),
    name: data.name,
    price: data.price,
    billingCycle: data.billingCycle.toLowerCase(),
    billingDate: data.billingDate,
    category: data.category,
    color: data.color,
    icon: data.icon,
    memo: data.memo,
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

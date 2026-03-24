import dayjs from 'dayjs';
import {
  Subscription,
  SubscriptionSummary,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  UpcomingPayment,
} from '../types/subscription';

// Mock 데이터 — 실제 백엔드 연결 시 이 파일만 수정하면 됨
let mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Netflix',
    price: 17000,
    billingCycle: 'monthly',
    billingDate: 15,
    category: 'video',
    color: '#E50914',
    icon: '🎬',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'YouTube Premium',
    price: 14900,
    billingCycle: 'monthly',
    billingDate: 20,
    category: 'video',
    color: '#FF0000',
    icon: '▶️',
    isActive: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: '3',
    name: 'Spotify',
    price: 10900,
    billingCycle: 'monthly',
    billingDate: 5,
    category: 'music',
    color: '#1DB954',
    icon: '🎵',
    isActive: true,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function calculateUpcomingPayments(subscriptions: Subscription[]): UpcomingPayment[] {
  const today = dayjs();
  return subscriptions
    .filter((s) => s.isActive)
    .map((s) => {
      let dueDate = today.date(s.billingDate);
      if (dueDate.isBefore(today, 'day')) {
        dueDate = dueDate.add(1, 'month');
      }
      return {
        subscription: s,
        dueDate: dueDate.format('YYYY-MM-DD'),
        daysUntil: dueDate.diff(today, 'day'),
      };
    })
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

// API 함수들 — 백엔드 연결 시 axios 호출로 교체
export const api = {
  async getSubscriptions(): Promise<Subscription[]> {
    return [...mockSubscriptions];
  },

  async createSubscription(req: CreateSubscriptionRequest): Promise<Subscription> {
    const now = dayjs().format('YYYY-MM-DD');
    const newSub: Subscription = {
      id: generateId(),
      ...req,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    mockSubscriptions.push(newSub);
    return newSub;
  },

  async updateSubscription(id: string, req: UpdateSubscriptionRequest): Promise<Subscription> {
    const index = mockSubscriptions.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Subscription not found');
    mockSubscriptions[index] = {
      ...mockSubscriptions[index],
      ...req,
      updatedAt: dayjs().format('YYYY-MM-DD'),
    };
    return mockSubscriptions[index];
  },

  async deleteSubscription(id: string): Promise<void> {
    mockSubscriptions = mockSubscriptions.filter((s) => s.id !== id);
  },

  async getSummary(): Promise<SubscriptionSummary> {
    const active = mockSubscriptions.filter((s) => s.isActive);
    const totalMonthly = active.reduce((sum, s) => {
      if (s.billingCycle === 'monthly') return sum + s.price;
      if (s.billingCycle === 'yearly') return sum + Math.round(s.price / 12);
      if (s.billingCycle === 'weekly') return sum + s.price * 4;
      return sum;
    }, 0);

    return {
      totalMonthly,
      totalYearly: totalMonthly * 12,
      activeCount: active.length,
      upcomingPayments: calculateUpcomingPayments(active).slice(0, 5),
    };
  },
};

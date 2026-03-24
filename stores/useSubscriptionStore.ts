import { create } from 'zustand';
import { Subscription, SubscriptionSummary, CreateSubscriptionRequest, UpdateSubscriptionRequest } from '../types/subscription';
import { api } from '../services/api';

interface SubscriptionState {
  subscriptions: Subscription[];
  summary: SubscriptionSummary | null;
  isLoading: boolean;
  fetchSubscriptions: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  addSubscription: (req: CreateSubscriptionRequest) => Promise<void>;
  updateSubscription: (id: string, req: UpdateSubscriptionRequest) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscriptions: [],
  summary: null,
  isLoading: false,

  fetchSubscriptions: async () => {
    set({ isLoading: true });
    const subscriptions = await api.getSubscriptions();
    set({ subscriptions, isLoading: false });
  },

  fetchSummary: async () => {
    const summary = await api.getSummary();
    set({ summary });
  },

  addSubscription: async (req) => {
    await api.createSubscription(req);
    const subscriptions = await api.getSubscriptions();
    const summary = await api.getSummary();
    set({ subscriptions, summary });
  },

  updateSubscription: async (id, req) => {
    await api.updateSubscription(id, req);
    const subscriptions = await api.getSubscriptions();
    const summary = await api.getSummary();
    set({ subscriptions, summary });
  },

  deleteSubscription: async (id) => {
    await api.deleteSubscription(id);
    const subscriptions = await api.getSubscriptions();
    const summary = await api.getSummary();
    set({ subscriptions, summary });
  },
}));

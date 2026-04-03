import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subscription, SubscriptionSummary } from '../types/subscription';

const KEYS = {
  subscriptions: 'cache_subscriptions',
  summary: 'cache_summary',
};

export async function cacheSubscriptions(data: Subscription[]) {
  try {
    await AsyncStorage.setItem(KEYS.subscriptions, JSON.stringify(data));
  } catch {}
}

export async function getCachedSubscriptions(): Promise<Subscription[] | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.subscriptions);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function cacheSummary(data: SubscriptionSummary) {
  try {
    await AsyncStorage.setItem(KEYS.summary, JSON.stringify(data));
  } catch {}
}

export async function getCachedSummary(): Promise<SubscriptionSummary | null> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.summary);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

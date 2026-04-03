import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { ColorScheme } from '../constants/colors';
import { useCurrencyStore } from '../stores/useCurrencyStore';
import { Subscription } from '../types/subscription';
import dayjs from 'dayjs';

interface Props {
  subscriptions: Subscription[];
}

export default function MonthlyReport({ subscriptions }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { formatPrice } = useCurrencyStore();

  const active = subscriptions.filter((s) => s.isActive);
  const paused = subscriptions.filter((s) => !s.isActive);

  if (active.length === 0 && paused.length === 0) return null;

  const totalMonthly = active.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.price;
    if (s.billingCycle === 'yearly') return sum + Math.round(s.price / 12);
    if (s.billingCycle === 'weekly') return sum + s.price * 4;
    return sum;
  }, 0);

  const pausedSavings = paused.reduce((sum, s) => {
    if (s.billingCycle === 'monthly') return sum + s.price;
    if (s.billingCycle === 'yearly') return sum + Math.round(s.price / 12);
    if (s.billingCycle === 'weekly') return sum + s.price * 4;
    return sum;
  }, 0);

  const mostExpensive = active.length > 0
    ? [...active].sort((a, b) => b.price - a.price)[0]
    : null;

  const endingSoon = subscriptions.filter((s) => {
    if (!s.endDate) return false;
    const daysLeft = dayjs(s.endDate).diff(dayjs(), 'day');
    return daysLeft >= 0 && daysLeft <= 30;
  });

  const insights: string[] = [];

  if (totalMonthly > 0) {
    insights.push(`이번 달 구독 지출은 ${formatPrice(totalMonthly)}이에요.`);
  }
  if (totalMonthly > 100000) {
    insights.push(`월 10만원 이상 구독 중이에요. 불필요한 구독이 없는지 확인해보세요.`);
  }
  if (pausedSavings > 0) {
    insights.push(`일시정지한 구독으로 월 ${formatPrice(pausedSavings)}을 절약하고 있어요.`);
  }
  if (mostExpensive) {
    insights.push(`가장 비싼 구독은 ${mostExpensive.name} (${formatPrice(mostExpensive.price)})이에요.`);
  }
  if (endingSoon.length > 0) {
    insights.push(`${endingSoon.map((s) => s.name).join(', ')} 약정이 곧 종료돼요.`);
  }

  if (insights.length === 0) return null;

  const currentMonth = dayjs().format('M월');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentMonth} 리포트</Text>
      {insights.map((text, i) => (
        <View key={i} style={styles.insightRow}>
          <View style={styles.dot} />
          <Text style={styles.insightText}>{text}</Text>
        </View>
      ))}
    </View>
  );
}

const createStyles = (colors: ColorScheme) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 6,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

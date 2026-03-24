import { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNotification } from '../../hooks/useNotification';
import MonthlyChart from '../../components/MonthlyChart';
import UpcomingPayments from '../../components/UpcomingPayments';
import { COLORS } from '../../constants/colors';

export default function HomeScreen() {
  const { summary, isLoading, fetchSummary } = useSubscriptionStore();
  const { nickname } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useNotification();

  useEffect(() => {
    fetchSummary();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSummary();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        <Text style={styles.greeting}>
          {nickname ? `${nickname}님, 안녕하세요` : 'Subtly'}
        </Text>
        <Text style={styles.subtitle}>은근히 새는 구독, 한눈에.</Text>

        {isLoading && !summary ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : summary ? (
          <>
            <MonthlyChart
              totalMonthly={summary.totalMonthly}
              totalYearly={summary.totalYearly}
              activeCount={summary.activeCount}
            />
            <UpcomingPayments payments={summary.upcomingPayments} />
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>구독을 등록하고 지출을 관리해보세요</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import React from 'react';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
  loading: {
    paddingTop: 60,
    alignItems: 'center',
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
});

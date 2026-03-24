import { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useSubscriptionStore } from '../../stores/useSubscriptionStore';
import MonthlyChart from '../../components/MonthlyChart';
import UpcomingPayments from '../../components/UpcomingPayments';
import { COLORS } from '../../constants/colors';

export default function HomeScreen() {
  const { summary, fetchSummary } = useSubscriptionStore();

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Subtly</Text>
        <Text style={styles.subtitle}>은근히 새는 구독, 한눈에.</Text>

        {summary && (
          <>
            <MonthlyChart
              totalMonthly={summary.totalMonthly}
              totalYearly={summary.totalYearly}
              activeCount={summary.activeCount}
            />
            <UpcomingPayments payments={summary.upcomingPayments} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

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
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 24,
  },
});

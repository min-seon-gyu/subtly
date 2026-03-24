import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native';
import { useState } from 'react';
import { COLORS } from '../../constants/colors';

export default function SettingsScreen() {
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>설정</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림</Text>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>결제일 알림</Text>
              <Text style={styles.rowSub}>결제일 전 미리 알려드립니다</Text>
            </View>
            <Switch
              value={notificationEnabled}
              onValueChange={setNotificationEnabled}
              trackColor={{ true: COLORS.primary }}
            />
          </View>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.rowLabel}>사전 알림 일수</Text>
              <Text style={styles.rowSub}>결제일 {reminderDays}일 전 알림</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setReminderDays(Math.max(1, reminderDays - 1))}
              >
                <Text style={styles.stepperText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{reminderDays}</Text>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setReminderDays(Math.min(7, reminderDays + 1))}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>버전</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
        </View>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
  },
  rowInfo: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  rowSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rowValue: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 20,
    textAlign: 'center',
  },
});

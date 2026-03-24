import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, CATEGORIES } from '../constants/colors';
import { BillingCycle, CreateSubscriptionRequest } from '../types/subscription';

interface Props {
  initialValues?: Partial<CreateSubscriptionRequest>;
  onSubmit: (data: CreateSubscriptionRequest) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const CYCLES: { label: string; value: BillingCycle }[] = [
  { label: '매월', value: 'monthly' },
  { label: '매년', value: 'yearly' },
  { label: '매주', value: 'weekly' },
];

export default function SubscriptionForm({ initialValues, onSubmit, onCancel, submitLabel = '추가' }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [price, setPrice] = useState(initialValues?.price?.toString() ?? '');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialValues?.billingCycle ?? 'monthly');
  const [billingDate, setBillingDate] = useState(initialValues?.billingDate?.toString() ?? '1');
  const [category, setCategory] = useState(initialValues?.category ?? 'other');
  const [memo, setMemo] = useState(initialValues?.memo ?? '');

  const selectedCategory = CATEGORIES.find((c) => c.value === category);
  const selectedColor = COLORS.categoryColors[CATEGORIES.findIndex((c) => c.value === category)] ?? COLORS.primary;

  const handleSubmit = () => {
    if (!name.trim() || !price.trim()) return;
    onSubmit({
      name: name.trim(),
      price: parseInt(price, 10),
      billingCycle,
      billingDate: parseInt(billingDate, 10) || 1,
      category,
      color: selectedColor,
      icon: selectedCategory?.icon ?? '📦',
      memo: memo.trim() || undefined,
    });
  };

  const isValid = name.trim().length > 0 && price.trim().length > 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>서비스명</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="예: Netflix, Spotify"
          placeholderTextColor={COLORS.textMuted}
        />

        <Text style={styles.label}>금액 (원)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          placeholder="예: 17000"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
        />

        <Text style={styles.label}>결제 주기</Text>
        <View style={styles.cycleRow}>
          {CYCLES.map((c) => (
            <TouchableOpacity
              key={c.value}
              style={[styles.cycleButton, billingCycle === c.value && styles.cycleButtonActive]}
              onPress={() => setBillingCycle(c.value)}
            >
              <Text style={[styles.cycleText, billingCycle === c.value && styles.cycleTextActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>결제일</Text>
        <TextInput
          style={styles.input}
          value={billingDate}
          onChangeText={setBillingDate}
          placeholder="1-31"
          placeholderTextColor={COLORS.textMuted}
          keyboardType="numeric"
        />

        <Text style={styles.label}>카테고리</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.value}
              style={[styles.categoryButton, category === c.value && styles.categoryButtonActive]}
              onPress={() => setCategory(c.value)}
            >
              <Text style={styles.categoryIcon}>{c.icon}</Text>
              <Text style={[styles.categoryLabel, category === c.value && styles.categoryLabelActive]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>메모 (선택)</Text>
        <TextInput
          style={[styles.input, styles.memoInput]}
          value={memo}
          onChangeText={setMemo}
          placeholder="메모를 입력하세요"
          placeholderTextColor={COLORS.textMuted}
          multiline
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid}
          >
            <Text style={styles.submitText}>{submitLabel}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  memoInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  cycleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cycleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cycleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cycleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  cycleTextActive: {
    color: '#FFFFFF',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    width: '22%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  categoryLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native';
import SubscriptionForm from '../components/SubscriptionForm';
import { useSubscriptionStore } from '../stores/useSubscriptionStore';
import { CreateSubscriptionRequest } from '../types/subscription';
import { COLORS } from '../constants/colors';

export default function AddScreen() {
  const router = useRouter();
  const { addSubscription } = useSubscriptionStore();

  const handleSubmit = async (data: CreateSubscriptionRequest) => {
    await addSubscription(data);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <SubscriptionForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          submitLabel="추가"
        />
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
  },
});

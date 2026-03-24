import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

export async function schedulePaymentReminder(
  subscriptionName: string,
  billingDate: number,
  reminderDaysBefore: number,
) {
  const now = new Date();
  let dueDate = new Date(now.getFullYear(), now.getMonth(), billingDate);

  if (dueDate <= now) {
    dueDate = new Date(now.getFullYear(), now.getMonth() + 1, billingDate);
  }

  const reminderDate = new Date(dueDate);
  reminderDate.setDate(reminderDate.getDate() - reminderDaysBefore);

  if (reminderDate <= now) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '💸 결제일 알림',
      body: `${subscriptionName} 결제일이 ${reminderDaysBefore}일 후입니다.`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
    },
  });
}

export function useNotification() {
  useEffect(() => {
    registerForPushNotifications();
  }, []);
}

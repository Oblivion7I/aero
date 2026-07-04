import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import SettingsScreen from '@screens/Settings/SettingsScreen';
import NotificationSettingsScreen from '@screens/Settings/NotificationSettingsScreen';
import CloudBackupScreen from '@screens/CloudBackup/CloudBackupScreen';
import TrustedContactsScreen from '@screens/TrustedContacts/TrustedContactsScreen';
import EmergencyScreen from '@screens/Emergency/EmergencyScreen';
import ActivityTimelineScreen from '@screens/ActivityTimeline/ActivityTimelineScreen';
import AnalyticsScreen from '@screens/Analytics/AnalyticsScreen';
import AboutScreen from '@screens/About/AboutScreen';
import FeedbackScreen from '@screens/Feedback/FeedbackScreen';
import PremiumScreen from '@screens/Premium/PremiumScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsStackNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: 'Notification Settings' }} />
      <Stack.Screen name="CloudBackup" component={CloudBackupScreen} options={{ title: 'Cloud Backup' }} />
      <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} options={{ title: 'Trusted Contacts' }} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency' }} />
      <Stack.Screen name="ActivityTimeline" component={ActivityTimelineScreen} options={{ title: 'Activity Timeline' }} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      <Stack.Screen name="Premium" component={PremiumScreen} options={{ title: 'Premium' }} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} options={{ title: 'Feedback' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
    </Stack.Navigator>
  );
};

export default SettingsStackNavigator;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SecurityStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import SecurityScreen from '@screens/Security/SecurityScreen';
import PermissionCenterScreen from '@screens/Security/PermissionCenterScreen';
import ActiveSessionsScreen from '@screens/Security/ActiveSessionsScreen';
import LoginHistoryScreen from '@screens/Security/LoginHistoryScreen';

const Stack = createNativeStackNavigator<SecurityStackParamList>();

const SecurityStackNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="SecurityHome" component={SecurityScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="PermissionCenter"
        component={PermissionCenterScreen}
        options={{ title: 'Permission Center' }}
      />
      <Stack.Screen
        name="ActiveSessions"
        component={ActiveSessionsScreen}
        options={{ title: 'Active Sessions' }}
      />
      <Stack.Screen
        name="LoginHistory"
        component={LoginHistoryScreen}
        options={{ title: 'Login & Activity History' }}
      />
    </Stack.Navigator>
  );
};

export default SecurityStackNavigator;

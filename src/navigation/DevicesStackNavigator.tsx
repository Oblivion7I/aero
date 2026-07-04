import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import DevicesScreen from '@screens/Devices/DevicesScreen';
import DeviceDetailsScreen from '@screens/Devices/DeviceDetailsScreen';
import DeviceHealthScreen from '@screens/Devices/DeviceHealthScreen';
import LocationScreen from '@screens/Location/LocationScreen';
import SafeZonesScreen from '@screens/Location/SafeZonesScreen';
import MovementHistoryScreen from '@screens/Location/MovementHistoryScreen';
import LostModeScreen from '@screens/LostMode/LostModeScreen';

const Stack = createNativeStackNavigator<DevicesStackParamList>();

const DevicesStackNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="DevicesList" component={DevicesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DeviceDetails" component={DeviceDetailsScreen} options={{ title: 'Device Details' }} />
      <Stack.Screen name="DeviceHealth" component={DeviceHealthScreen} options={{ title: 'Device Health' }} />
      <Stack.Screen name="Location" component={LocationScreen} options={{ title: 'Location' }} />
      <Stack.Screen name="SafeZones" component={SafeZonesScreen} options={{ title: 'Safe Zones' }} />
      <Stack.Screen
        name="MovementHistory"
        component={MovementHistoryScreen}
        options={{ title: 'Location Timeline' }}
      />
      <Stack.Screen name="LostMode" component={LostModeScreen} options={{ title: 'Lost Mode' }} />
    </Stack.Navigator>
  );
};

export default DevicesStackNavigator;

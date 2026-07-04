import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { Colors } from '@constants/colors';
import DashboardScreen from '@screens/Dashboard/DashboardScreen';
import DevicesStackNavigator from '@navigation/DevicesStackNavigator';
import SecurityStackNavigator from '@navigation/SecurityStackNavigator';
import SettingsStackNavigator from '@navigation/SettingsStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
      }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Devices" component={DevicesStackNavigator} />
      <Tab.Screen name="Security" component={SecurityStackNavigator} />
      <Tab.Screen name="Settings" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

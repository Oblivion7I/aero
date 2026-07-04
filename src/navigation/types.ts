export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OwnerVerification: undefined;
  MainTabs: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Devices: undefined;
  Security: undefined;
  Settings: undefined;
};

export type SecurityStackParamList = {
  SecurityHome: undefined;
  PermissionCenter: undefined;
  ActiveSessions: undefined;
  LoginHistory: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  NotificationSettings: undefined;
  CloudBackup: undefined;
  TrustedContacts: undefined;
  Emergency: undefined;
  ActivityTimeline: undefined;
  Analytics: undefined;
  About: undefined;
  Feedback: undefined;
  Premium: undefined;
};

export type DevicesStackParamList = {
  DevicesList: undefined;
  DeviceDetails: { deviceId: string };
  DeviceHealth: { deviceId: string };
  Location: { deviceId: string };
  SafeZones: { deviceId: string };
  MovementHistory: { deviceId: string };
  LostMode: { deviceId: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

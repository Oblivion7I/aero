import React, { useState } from 'react';
import { PermissionsAndroid, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'OwnerVerification'>;

interface PermissionItem {
  id: string;
  title: string;
  why: string;
  enabledFeatures: string;
}

const PERMISSIONS: PermissionItem[] = [
  {
    id: 'location',
    title: 'Location Access',
    why: 'Used to show this device\'s last known position on the map.',
    enabledFeatures: 'Live Location, Lost Mode, Safe Zones',
  },
  {
    id: 'device_admin',
    title: 'Device Administrator',
    why: 'Required so you can lock or wipe this device remotely if it is lost.',
    enabledFeatures: 'Lost Mode, Remote Lock, Remote Wipe',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    why: 'Lets Aero alert you about battery, security, and login events.',
    enabledFeatures: 'Security Alerts, Battery Alerts, Login Alerts',
  },
  {
    id: 'storage',
    title: 'Storage Access',
    why: 'Used only to report storage usage on your dashboard — files are never uploaded.',
    enabledFeatures: 'Storage Report, Device Health',
  },
];

/**
 * Maps each Owner Verification toggle to the actual Android runtime
 * permission(s) it needs. Device Administrator has no PermissionsAndroid
 * equivalent — it requires a dedicated DevicePolicyManager activation
 * flow (ACTION_ADD_DEVICE_ADMIN intent) that isn't part of this scaffold.
 */
const ANDROID_PERMISSIONS: Record<string, string[]> = {
  location: [
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ],
  notifications:
    Platform.OS === 'android' && Platform.Version >= 33
      ? [PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS]
      : [],
  storage: [], // Scoped storage on modern Android needs no runtime grant for app-internal reporting.
  device_admin: [], // Handled separately via DevicePolicyManager — not a PermissionsAndroid permission.
};

const OwnerVerificationScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [granted, setGranted] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setGranted(prev => ({ ...prev, [id]: !prev[id] }));

  const handleContinue = async () => {
    if (Platform.OS === 'android') {
      const grantedIds = Object.entries(granted)
        .filter(([, isGranted]) => isGranted)
        .map(([id]) => id);

      const permissionsToRequest = grantedIds.flatMap(id => ANDROID_PERMISSIONS[id] ?? []);
      if (permissionsToRequest.length > 0) {
        try {
          await PermissionsAndroid.requestMultiple(permissionsToRequest as never[]);
        } catch {
          // If the system dialog fails for any reason, proceed anyway —
          // affected features will simply degrade gracefully, matching the
          // "no crash on revoked permission" rule in the developer guide.
        }
      }
    }
    navigation.replace('MainTabs');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: theme.text }]}>Verify device ownership</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Before Aero can manage this device, confirm you own it and review what each
          permission does. You can revoke any of these later in Settings → Permissions.
        </Text>

        {PERMISSIONS.map(item => (
          <View key={item.id} style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
              <Switch
                value={!!granted[item.id]}
                onValueChange={() => toggle(item.id)}
                trackColor={{ false: theme.border, true: Colors.primary }}
              />
            </View>
            <Text style={[styles.cardWhy, { color: theme.textSecondary }]}>{item.why}</Text>
            <Text style={[styles.cardFeatures, { color: Colors.primary }]}>
              Enables: {item.enabledFeatures}
            </Text>
          </View>
        ))}

        <Text style={[styles.footnote, { color: theme.textSecondary }]}>
          You must own or have explicit authorization to manage this device. Misuse of
          device-management features against another person without consent may be illegal.
        </Text>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Confirm Ownership &amp; Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.xs },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  card: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  cardWhy: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginTop: Spacing.xs,
    lineHeight: 19,
  },
  cardFeatures: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    marginTop: Spacing.sm,
  },
  footnote: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: 17,
    marginTop: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    margin: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
});

export default OwnerVerificationScreen;

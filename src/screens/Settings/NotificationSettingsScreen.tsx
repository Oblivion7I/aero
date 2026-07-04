import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';

interface ToggleConfig {
  key: string;
  label: string;
  description: string;
}

const TOGGLES: ToggleConfig[] = [
  { key: 'battery', label: 'Battery Alerts', description: 'Low battery and charging status changes' },
  { key: 'device_status', label: 'Device Online/Offline', description: 'When a device comes online or goes offline' },
  { key: 'location', label: 'Location Updates', description: 'When a device location is updated' },
  { key: 'security', label: 'Security Alerts', description: 'Permission changes and security events' },
  { key: 'login', label: 'Login Alerts', description: 'New sign-ins to your account' },
  { key: 'backup', label: 'Backup Completed', description: 'Cloud backup confirmations' },
];

const NotificationSettingsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map(t => [t.key, true])),
  );

  const toggle = (key: string) => setEnabled(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      {TOGGLES.map(t => (
        <View key={t.key} style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={[styles.label, { color: theme.text }]}>{t.label}</Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>{t.description}</Text>
            </View>
            <Switch
              value={enabled[t.key]}
              onValueChange={() => toggle(t.key)}
              trackColor={{ false: theme.border, true: Colors.primary }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1, marginRight: Spacing.sm },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.base },
  description: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
});

export default NotificationSettingsScreen;

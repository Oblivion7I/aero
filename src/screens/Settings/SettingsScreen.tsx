import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList, RootStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { ThemeMode } from '@constants/colors';
import { signOutUser } from '@services/authService';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsHome'>;

interface RowProps {
  title: string;
  subtitle?: string;
  onPress: () => void;
}

const THEME_OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
  { mode: 'amoled', label: 'AMOLED' },
];

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { theme, mode, setMode } = useAppTheme();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'You will need to sign in again to manage your devices.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOutUser();
            rootNavigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          } catch {
            Alert.alert('Error', 'Could not sign out. Please try again.');
          }
        },
      },
    ]);
  };

  const Row: React.FC<RowProps> = ({ title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View>
        <Text style={[styles.rowTitle, { color: theme.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.rowSub, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      <Text style={[styles.arrow, { color: Colors.primary }]}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Appearance</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <View style={styles.themeRow}>
          {THEME_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.mode}
              style={[
                styles.themeChip,
                {
                  backgroundColor: mode === opt.mode ? Colors.primary : 'transparent',
                  borderColor: mode === opt.mode ? Colors.primary : theme.border,
                },
              ]}
              onPress={() => setMode(opt.mode)}
              activeOpacity={0.85}>
              <Text style={{ color: mode === opt.mode ? '#FFFFFF' : theme.text, fontFamily: FontFamily.medium, fontSize: FontSize.xs }}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Notifications &amp; Cloud</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Row title="Notification Settings" onPress={() => navigation.navigate('NotificationSettings')} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Row title="Cloud Backup" subtitle="Sync, restore, backup history" onPress={() => navigation.navigate('CloudBackup')} />
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Family &amp; Emergency</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Row title="Trusted Contacts" onPress={() => navigation.navigate('TrustedContacts')} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Row title="Emergency" subtitle="SOS, medical info" onPress={() => navigation.navigate('Emergency')} />
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Insights</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Row title="Activity Timeline" onPress={() => navigation.navigate('ActivityTimeline')} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Row title="Analytics" subtitle="Battery, storage, RAM reports" onPress={() => navigation.navigate('Analytics')} />
      </View>

      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>About</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Row title="Premium" onPress={() => navigation.navigate('Premium')} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Row title="Feedback" onPress={() => navigation.navigate('Feedback')} />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <Row title="About Aero" onPress={() => navigation.navigate('About')} />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} activeOpacity={0.85}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.lg },
  sectionLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.xs, marginTop: Spacing.md },
  card: { borderRadius: Radius.card, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.md },
  rowTitle: { fontFamily: FontFamily.medium, fontSize: FontSize.base },
  rowSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  arrow: { fontSize: FontSize.xl, fontFamily: FontFamily.bold },
  divider: { height: StyleSheet.hairlineWidth },
  themeRow: { flexDirection: 'row', paddingVertical: Spacing.md },
  themeChip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, marginRight: Spacing.sm },
  signOutButton: {
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  signOutText: { color: Colors.danger, fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
});

export default SettingsScreen;

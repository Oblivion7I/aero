import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';

const FEATURES = [
  'Unlimited registered devices',
  'Extended location history (90 days)',
  'Priority cloud backup',
  'Advanced analytics & monthly reports',
  'Family dashboard for shared devices',
];

const PremiumScreen: React.FC = () => {
  const { theme } = useAppTheme();
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Aero Premium</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Unlock the full protection suite.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        {FEATURES.map(f => (
          <View key={f} style={styles.featureRow}>
            <Text style={styles.check}>✓</Text>
            <Text style={[styles.featureText, { color: theme.text }]}>{f}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.upgradeButton} activeOpacity={0.85}>
        <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
      </TouchableOpacity>
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Billing integration to be connected to your payment provider.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginBottom: Spacing.lg },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.lg },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
  check: { color: Colors.success, fontFamily: FontFamily.bold, marginRight: Spacing.sm },
  featureText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  upgradeButton: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: Spacing.md, alignItems: 'center' },
  upgradeButtonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  note: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.sm },
});

export default PremiumScreen;

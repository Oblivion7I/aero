import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';

const AboutScreen: React.FC = () => {
  const { theme } = useAppTheme();
  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.appName, { color: theme.text }]}>Aero</Text>
      <Text style={[styles.tagline, { color: theme.textSecondary }]}>Secure. Protect. Recover.</Text>

      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Text style={[styles.row, { color: theme.text }]}>Version 1.0.0</Text>
        <Text style={[styles.row, { color: theme.text }]}>Developer: Md Arafat Hossen Mugdho</Text>
        <Text style={[styles.row, { color: theme.text }]}>Brand: AFM Technologies</Text>
        <Text style={[styles.row, { color: theme.text }]}>Platform: Android</Text>
      </View>

      <Text style={[styles.legal, { color: theme.textSecondary }]}>
        Aero manages a device only after explicit installation, permission grants, and owner
        verification by the device's owner. Misuse against another person without consent may be
        illegal.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, alignItems: 'center', paddingBottom: Spacing.xxl },
  appName: { fontFamily: FontFamily.bold, fontSize: FontSize.display },
  tagline: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginBottom: Spacing.xl },
  card: { borderRadius: Radius.card, padding: Spacing.md, width: '100%', marginBottom: Spacing.lg },
  row: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, paddingVertical: Spacing.xs },
  legal: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, textAlign: 'center', lineHeight: 18 },
});

export default AboutScreen;

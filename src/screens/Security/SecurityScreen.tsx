import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SecurityStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useSecurityCenter } from '@hooks/useSecurityCenter';
import ProgressBar from '@components/ProgressBar';

type Props = NativeStackScreenProps<SecurityStackParamList, 'SecurityHome'>;

const scoreLabel = (score: number): string => {
  if (score >= 85) return 'Strong';
  if (score >= 60) return 'Fair';
  return 'Weak';
};

const SecurityScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { score, permissions, sessions, events } = useSecurityCenter();

  const grantedCount = permissions.filter(p => p.granted).length;
  const recentEvent = events[0];

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Security Center</Text>

      <View style={[styles.scoreCard, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Text style={[styles.scoreLabel, { color: theme.textSecondary }]}>Security Score</Text>
        <Text style={[styles.scoreValue, { color: theme.text }]}>{score}</Text>
        <ProgressBar label={scoreLabel(score)} percent={score} />
      </View>

      <TouchableOpacity
        style={[styles.linkCard, { backgroundColor: theme.surface }, Shadow.soft]}
        onPress={() => navigation.navigate('PermissionCenter')}
        activeOpacity={0.85}>
        <View>
          <Text style={[styles.linkTitle, { color: theme.text }]}>Permission Center</Text>
          <Text style={[styles.linkSub, { color: theme.textSecondary }]}>
            {grantedCount} of {permissions.length} permissions granted
          </Text>
        </View>
        <Text style={[styles.linkArrow, { color: Colors.primary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.linkCard, { backgroundColor: theme.surface }, Shadow.soft]}
        onPress={() => navigation.navigate('ActiveSessions')}
        activeOpacity={0.85}>
        <View>
          <Text style={[styles.linkTitle, { color: theme.text }]}>Active Sessions &amp; Trusted Devices</Text>
          <Text style={[styles.linkSub, { color: theme.textSecondary }]}>
            {sessions.length} active session{sessions.length === 1 ? '' : 's'}
          </Text>
        </View>
        <Text style={[styles.linkArrow, { color: Colors.primary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.linkCard, { backgroundColor: theme.surface }, Shadow.soft]}
        onPress={() => navigation.navigate('LoginHistory')}
        activeOpacity={0.85}>
        <View>
          <Text style={[styles.linkTitle, { color: theme.text }]}>Login &amp; Activity History</Text>
          {recentEvent ? (
            <Text style={[styles.linkSub, { color: theme.textSecondary }]} numberOfLines={1}>
              Latest: {recentEvent.description}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.linkArrow, { color: Colors.primary }]}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.lg },
  scoreCard: { borderRadius: Radius.card, padding: Spacing.lg, marginBottom: Spacing.lg },
  scoreLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  scoreValue: { fontFamily: FontFamily.bold, fontSize: FontSize.display, marginVertical: Spacing.xs },
  linkCard: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  linkTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  linkSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2, maxWidth: 240 },
  linkArrow: { fontSize: FontSize.xl, fontFamily: FontFamily.bold },
});

export default SecurityScreen;

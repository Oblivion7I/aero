import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useNotifications } from '@hooks/useNotifications';

interface StatTileProps {
  label: string;
  value: string;
}

const StatTile: React.FC<StatTileProps & { background: string; textColor: string }> = ({
  label,
  value,
  background,
  textColor,
}) => (
  <View style={[styles.tile, { backgroundColor: background }, Shadow.soft]}>
    <Text style={[styles.tileValue, { color: textColor }]}>{value}</Text>
    <Text style={[styles.tileLabel, { color: textColor }]}>{label}</Text>
  </View>
);

const DashboardScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { unreadCount } = useNotifications();

  // Placeholder data — to be wired to DeviceService / native modules.
  const stats: StatTileProps[] = [
    { label: 'Battery', value: '82%' },
    { label: 'Storage', value: '54 GB free' },
    { label: 'RAM', value: '3.1 / 6 GB' },
    { label: 'Android', value: '14' },
  ];

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.scroll}>
      <View style={styles.headerRow}>
        <Text style={[styles.greeting, { color: theme.text }]}>My Device</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bellButton}>
          <Text style={styles.bellIcon}>🔔</Text>
          {unreadCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <View style={[styles.statusCard, { backgroundColor: theme.surface }, Shadow.soft]}>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
          <Text style={[styles.statusText, { color: theme.text }]}>Online &amp; Protected</Text>
        </View>
        <Text style={[styles.statusSub, { color: theme.textSecondary }]}>
          Security score: 92 / 100
        </Text>
      </View>

      <View style={styles.grid}>
        {stats.map(stat => (
          <StatTile
            key={stat.label}
            {...stat}
            background={theme.surface}
            textColor={theme.text}
          />
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
      <View style={[styles.actionsCard, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Text style={[styles.actionItem, { color: theme.text }]}>Locate Device</Text>
        <Text style={[styles.actionItem, { color: theme.text }]}>Enable Lost Mode</Text>
        <Text style={[styles.actionItem, { color: theme.text }]}>Run Security Scan</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  bellButton: { padding: Spacing.xs },
  bellIcon: { fontSize: FontSize.xl },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.danger,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontFamily: FontFamily.bold },
  greeting: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl },
  statusCard: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.lg },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 10, height: 10, borderRadius: Radius.full, marginRight: Spacing.sm },
  statusText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  statusSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    borderRadius: Radius.card,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  tileValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  tileLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: Spacing.xs },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actionsCard: { borderRadius: Radius.card, padding: Spacing.md },
  actionItem: { fontFamily: FontFamily.medium, fontSize: FontSize.base, paddingVertical: Spacing.sm },
});

export default DashboardScreen;

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { Device, getStorageFreeGb } from '@models/Device';

interface Props {
  device: Device;
  onPress: () => void;
}

const statusColor = (status: Device['status']): string => {
  if (status === 'online') return Colors.success;
  if (status === 'lost') return Colors.danger;
  return Colors.warning;
};

const statusLabel = (status: Device['status']): string => {
  if (status === 'online') return 'Online';
  if (status === 'lost') return 'Lost Mode';
  return 'Offline';
};

const DeviceCard: React.FC<Props> = ({ device, onPress }) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {device.name}
        </Text>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: statusColor(device.status) }]} />
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>
            {statusLabel(device.status)}
          </Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        {device.manufacturer} {device.model} · Android {device.androidVersion}
      </Text>

      <View style={styles.metaRow}>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          🔋 {device.batteryLevel}%{device.isCharging ? ' (charging)' : ''}
        </Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          💾 {getStorageFreeGb(device)} GB free
        </Text>
      </View>

      {device.group ? (
        <View style={[styles.groupBadge, { backgroundColor: Colors.primary + '15' }]}>
          <Text style={styles.groupText}>{device.group}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base, flex: 1, marginRight: Spacing.sm },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: Radius.full, marginRight: 6 },
  statusText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  metaRow: { flexDirection: 'row', marginTop: Spacing.sm },
  meta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginRight: Spacing.lg },
  groupBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  groupText: { color: Colors.primary, fontFamily: FontFamily.medium, fontSize: FontSize.xs },
});

export default DeviceCard;

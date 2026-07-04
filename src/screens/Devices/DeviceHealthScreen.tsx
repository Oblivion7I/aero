import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { useDevices } from '@hooks/useDevices';
import { getHealthLabel, getRamPercentUsed, getStoragePercentUsed } from '@models/Device';
import ProgressBar from '@components/ProgressBar';
import { Colors } from '@constants/colors';

type Props = NativeStackScreenProps<DevicesStackParamList, 'DeviceHealth'>;

const DeviceHealthScreen: React.FC<Props> = ({ route }) => {
  const { theme } = useAppTheme();
  const { getDevice } = useDevices();
  const device = getDevice(route.params.deviceId);

  if (!device) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Device not found.</Text>
      </View>
    );
  }

  const health = getHealthLabel(device);
  const healthColor =
    health === 'Excellent' ? Colors.success : health === 'Good' ? Colors.warning : Colors.danger;

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <View style={[styles.summaryCard, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Overall Health</Text>
        <Text style={[styles.summaryValue, { color: healthColor }]}>{health}</Text>
        <Text style={[styles.summarySub, { color: theme.textSecondary }]}>
          Security score: {device.securityScore} / 100
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <ProgressBar
          label="Battery"
          percent={device.batteryLevel}
          detail={device.isCharging ? 'Currently charging' : 'Not charging'}
        />
        <ProgressBar
          label="Storage Used"
          percent={getStoragePercentUsed(device)}
          detail={`${device.storageUsedGb} GB of ${device.storageTotalGb} GB used`}
        />
        <ProgressBar
          label="RAM Used"
          percent={getRamPercentUsed(device)}
          detail={`${device.ramUsedGb} GB of ${device.ramTotalGb} GB used`}
        />
        <ProgressBar label="Security Score" percent={device.securityScore} />
      </View>

      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Health data refreshes whenever the device checks in. Last seen{' '}
        {new Date(device.lastSeenAt).toLocaleString()}.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  summaryCard: {
    borderRadius: Radius.card,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  summaryLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  summaryValue: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginVertical: Spacing.xs },
  summarySub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs },
  card: { borderRadius: Radius.card, padding: Spacing.md },
  note: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: Spacing.lg, textAlign: 'center' },
});

export default DeviceHealthScreen;

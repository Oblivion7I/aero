import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useDevices } from '@hooks/useDevices';
import { getRamPercentUsed, getStorageFreeGb, getStoragePercentUsed } from '@models/Device';
import { useDispatch } from 'react-redux';
import { setCurrentDevice } from '@redux/slices/deviceSlice';

type Props = NativeStackScreenProps<DevicesStackParamList, 'DeviceDetails'>;

interface InfoRowProps {
  label: string;
  value: string;
}

const DeviceDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useAppTheme();
  const { getDevice, renameDevice, setDeviceNotes, removeDevice } = useDevices();
  const device = getDevice(route.params.deviceId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (device) {
      dispatch(setCurrentDevice(device.id));
    }
  }, [device, dispatch]);

  const [name, setName] = useState(device?.name ?? '');
  const [notes, setNotes] = useState(device?.notes ?? '');

  if (!device) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Device not found.</Text>
      </View>
    );
  }

  const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <TextInput
        style={[styles.nameInput, { color: theme.text, borderColor: theme.border }]}
        value={name}
        onChangeText={setName}
        onBlur={() => renameDevice(device.id, name)}
        placeholder="Device name"
        placeholderTextColor={theme.textSecondary}
      />

      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <InfoRow label="Model" value={`${device.manufacturer} ${device.model}`} />
        <InfoRow label="Android Version" value={device.androidVersion} />
        <InfoRow label="Battery" value={`${device.batteryLevel}%${device.isCharging ? ' · Charging' : ''}`} />
        <InfoRow
          label="Storage"
          value={`${getStorageFreeGb(device)} GB free (${getStoragePercentUsed(device)}% used)`}
        />
        <InfoRow
          label="RAM"
          value={`${device.ramUsedGb} / ${device.ramTotalGb} GB (${getRamPercentUsed(device)}%)`}
        />
        <InfoRow label="Network" value={device.network === 'offline' ? 'Offline' : device.network.toUpperCase()} />
        <InfoRow label="Bluetooth" value={device.bluetoothEnabled ? 'On' : 'Off'} />
        <InfoRow label="Wi-Fi" value={device.wifiEnabled ? 'On' : 'Off'} />
        <InfoRow label="Group" value={device.group ?? 'Ungrouped'} />
      </View>

      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: theme.surface }, Shadow.soft]}
        onPress={() => navigation.navigate('LostMode', { deviceId: device.id })}
        activeOpacity={0.85}>
        <Text style={[styles.actionTitle, { color: Colors.danger }]}>Lost Mode</Text>
        <Text style={[styles.actionArrow, { color: Colors.danger }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: theme.surface }, Shadow.soft]}
        onPress={() => navigation.navigate('Location', { deviceId: device.id })}
        activeOpacity={0.85}>
        <Text style={[styles.actionTitle, { color: theme.text }]}>Locate Device</Text>
        <Text style={[styles.actionArrow, { color: Colors.primary }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionCard, { backgroundColor: theme.surface }, Shadow.soft]}
        onPress={() => navigation.navigate('DeviceHealth', { deviceId: device.id })}
        activeOpacity={0.85}>
        <Text style={[styles.actionTitle, { color: theme.text }]}>Device Health Report</Text>
        <Text style={[styles.actionArrow, { color: Colors.primary }]}>›</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Device Notes</Text>
      <TextInput
        style={[styles.notesInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        value={notes}
        onChangeText={setNotes}
        onBlur={() => setDeviceNotes(device.id, notes)}
        placeholder="Add a note about this device (e.g. who uses it, where it usually is)..."
        placeholderTextColor={theme.textSecondary}
        multiline
      />

      <TouchableOpacity
        style={styles.dangerButton}
        onPress={() => {
          removeDevice(device.id);
          navigation.goBack();
        }}
        activeOpacity={0.85}>
        <Text style={styles.dangerButtonText}>Remove Device</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  nameInput: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    borderBottomWidth: 1,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  infoLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  infoValue: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  actionCard: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  actionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  actionArrow: { fontSize: FontSize.xl, fontFamily: FontFamily.bold },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, marginBottom: Spacing.sm },
  notesInput: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 90,
    textAlignVertical: 'top',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginBottom: Spacing.xl,
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  dangerButtonText: { color: Colors.danger, fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
});

export default DeviceDetailsScreen;

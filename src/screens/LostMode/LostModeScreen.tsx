import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useLostMode } from '@hooks/useLostMode';
import { useDevices } from '@hooks/useDevices';
import { buildRecoveryCardPayload } from '@models/LostMode';

type Props = NativeStackScreenProps<DevicesStackParamList, 'LostMode'>;

const LostModeScreen: React.FC<Props> = ({ route }) => {
  const { theme } = useAppTheme();
  const { deviceId } = route.params;
  const { getDevice } = useDevices();
  const device = getDevice(deviceId);
  const { config, updateField, activate, deactivate, triggerAlarm, triggerFlashlightSos, isAlarmPlaying, isFlashlightActive } =
    useLostMode(deviceId);

  const confirmActivate = () => {
    Alert.alert(
      'Enable Lost Mode?',
      'This will show your message and contact details on the lock screen, and start continuous location updates until you turn Lost Mode off.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Enable', style: 'destructive', onPress: activate },
      ],
    );
  };

  const confirmDeactivate = () => {
    Alert.alert('Turn off Lost Mode?', 'The lock screen message will be removed and location updates will return to normal.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Turn Off', onPress: deactivate },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <View
        style={[
          styles.statusCard,
          { backgroundColor: config.isActive ? Colors.danger : theme.surface },
          Shadow.soft,
        ]}>
        <Text style={[styles.statusTitle, { color: config.isActive ? '#FFFFFF' : theme.text }]}>
          Lost Mode is {config.isActive ? 'ON' : 'Off'}
        </Text>
        {config.isActive && config.activatedAt ? (
          <Text style={styles.statusSub}>Since {new Date(config.activatedAt).toLocaleString()}</Text>
        ) : (
          <Text style={[styles.statusSub, { color: theme.textSecondary }]}>
            Turn this on if "{device?.name ?? 'this device'}" is lost or stolen.
          </Text>
        )}

        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: config.isActive ? '#FFFFFF' : Colors.danger }]}
          onPress={config.isActive ? confirmDeactivate : confirmActivate}
          activeOpacity={0.85}>
          <Text style={[styles.toggleButtonText, { color: config.isActive ? Colors.danger : '#FFFFFF' }]}>
            {config.isActive ? 'Turn Off Lost Mode' : 'Enable Lost Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      {config.isActive ? (
        <Text style={[styles.locationNotice, { color: theme.textSecondary }]}>
          Continuous location updates are active while Lost Mode is on. They stop automatically when
          you turn it off.
        </Text>
      ) : null}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Lock Screen Message</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <TextInput
          style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
          value={config.ownerMessage}
          onChangeText={t => updateField('ownerMessage', t)}
          placeholder="Message shown to whoever finds this device"
          placeholderTextColor={theme.textSecondary}
          multiline
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={config.contactNumber}
          onChangeText={t => updateField('contactNumber', t)}
          placeholder="Contact phone number"
          placeholderTextColor={theme.textSecondary}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={config.contactEmail}
          onChangeText={t => updateField('contactEmail', t)}
          placeholder="Contact email address"
          placeholderTextColor={theme.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={config.rewardMessage}
          onChangeText={t => updateField('rewardMessage', t)}
          placeholder="Reward message (optional)"
          placeholderTextColor={theme.textSecondary}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Recovery Tools</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>Loud Alarm</Text>
          <Switch
            value={config.alarmEnabled}
            onValueChange={v => updateField('alarmEnabled', v)}
            trackColor={{ false: theme.border, true: Colors.primary }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.text }]}>Flashlight SOS</Text>
          <Switch
            value={config.flashlightSosEnabled}
            onValueChange={v => updateField('flashlightSosEnabled', v)}
            trackColor={{ false: theme.border, true: Colors.primary }}
          />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { borderColor: isAlarmPlaying ? Colors.danger : theme.border, opacity: config.isActive ? 1 : 0.4 },
            ]}
            disabled={!config.isActive}
            onPress={triggerAlarm}
            activeOpacity={0.85}>
            <Text style={[styles.actionButtonText, { color: isAlarmPlaying ? Colors.danger : theme.text }]}>
              {isAlarmPlaying ? 'Stop Alarm' : 'Sound Alarm'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { borderColor: isFlashlightActive ? Colors.danger : theme.border, opacity: config.isActive ? 1 : 0.4 },
            ]}
            disabled={!config.isActive}
            onPress={triggerFlashlightSos}
            activeOpacity={0.85}>
            <Text style={[styles.actionButtonText, { color: isFlashlightActive ? Colors.danger : theme.text }]}>
              {isFlashlightActive ? 'Stop Flash' : 'Flash SOS'}
            </Text>
          </TouchableOpacity>
        </View>
        {!config.isActive ? (
          <Text style={[styles.disabledHint, { color: theme.textSecondary }]}>
            Enable Lost Mode to use these actions.
          </Text>
        ) : null}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>QR Recovery Card</Text>
      <View style={[styles.qrCard, { backgroundColor: theme.surface }, Shadow.soft]}>
        <QRCode
          value={buildRecoveryCardPayload(config, device?.name ?? 'Aero device')}
          size={160}
          backgroundColor="transparent"
          color={theme.text}
        />
        <Text style={[styles.qrHint, { color: theme.textSecondary }]}>
          Print this and attach it to your device. Scanning it shows your message and contact info
          without unlocking the device.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  statusCard: { borderRadius: Radius.card, padding: Spacing.lg, marginBottom: Spacing.sm },
  statusTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  statusSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, color: '#FFFFFFCC', marginTop: 2 },
  toggleButton: {
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  toggleButtonText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  locationNotice: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, marginBottom: Spacing.sm, marginTop: Spacing.md },
  card: { borderRadius: Radius.card, padding: Spacing.md },
  textArea: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.xs },
  toggleLabel: { fontFamily: FontFamily.medium, fontSize: FontSize.base },
  actionRow: { flexDirection: 'row', marginTop: Spacing.sm },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  actionButtonText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  disabledHint: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: Spacing.sm },
  qrCard: { borderRadius: Radius.card, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.lg },
  qrHint: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.md },
});

export default LostModeScreen;

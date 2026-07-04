import React, { useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useDeviceLocation } from '@hooks/useDeviceLocation';
import { SafeZone } from '@models/Location';

type Props = NativeStackScreenProps<DevicesStackParamList, 'SafeZones'>;

const SafeZonesScreen: React.FC<Props> = ({ route }) => {
  const { theme } = useAppTheme();
  const { safeZones, removeSafeZone, toggleZoneAlert, addSafeZone, lastKnownLocation } =
    useDeviceLocation(route.params.deviceId);
  const [newZoneName, setNewZoneName] = useState('');

  const handleAddZone = () => {
    if (!newZoneName.trim() || !lastKnownLocation) return;
    addSafeZone({
      name: newZoneName.trim(),
      latitude: lastKnownLocation.latitude,
      longitude: lastKnownLocation.longitude,
      radiusMeters: 200,
      alertOnEntry: false,
      alertOnExit: true,
    });
    setNewZoneName('');
  };

  const renderZone = ({ item }: { item: SafeZone }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.zoneName, { color: theme.text }]}>{item.name}</Text>
        <TouchableOpacity onPress={() => removeSafeZone(item.id)}>
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.zoneMeta, { color: theme.textSecondary }]}>
        {item.radiusMeters}m radius
      </Text>

      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: theme.text }]}>Alert on exit</Text>
        <Switch
          value={item.alertOnExit}
          onValueChange={() => toggleZoneAlert(item.id, 'alertOnExit')}
          trackColor={{ false: theme.border, true: Colors.primary }}
        />
      </View>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: theme.text }]}>Alert on entry</Text>
        <Switch
          value={item.alertOnEntry}
          onValueChange={() => toggleZoneAlert(item.id, 'alertOnEntry')}
          trackColor={{ false: theme.border, true: Colors.primary }}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.addRow}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
          placeholder="New safe zone name (e.g. School)"
          placeholderTextColor={theme.textSecondary}
          value={newZoneName}
          onChangeText={setNewZoneName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddZone} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>
        New zones are centered on the device's last known location — adjust on the map in a future
        update.
      </Text>

      <FlatList
        data={safeZones}
        keyExtractor={item => item.id}
        renderItem={renderZone}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            No safe zones yet. Add one above to get alerts when the device leaves or enters it.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  addRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginRight: Spacing.sm,
  },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    justifyContent: 'center',
  },
  addButtonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  hint: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginBottom: Spacing.lg },
  list: { paddingBottom: Spacing.xxl },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  zoneName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  remove: { color: Colors.danger, fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  zoneMeta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2, marginBottom: Spacing.sm },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  toggleLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  empty: { textAlign: 'center', fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xl },
});

export default SafeZonesScreen;

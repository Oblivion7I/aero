import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useDevices } from '@hooks/useDevices';
import DeviceCard from '@components/DeviceCard';

type Props = NativeStackScreenProps<DevicesStackParamList, 'DevicesList'>;

const DevicesScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const { devices, onlineCount } = useDevices();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Devices</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {onlineCount} of {devices.length} online
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>+ Register</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DeviceCard
            device={item}
            onPress={() => navigation.navigate('DeviceDetails', { deviceId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            No devices registered yet. Tap "+ Register" to add one after owner verification.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: 2 },
  addButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  addButtonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  list: { paddingBottom: Spacing.xxl },
  empty: { textAlign: 'center', fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xl },
});

export default DevicesScreen;

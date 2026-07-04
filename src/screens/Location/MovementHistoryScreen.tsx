import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useDeviceLocation } from '@hooks/useDeviceLocation';
import { LocationPoint } from '@models/Location';

type Props = NativeStackScreenProps<DevicesStackParamList, 'MovementHistory'>;

const MovementHistoryScreen: React.FC<Props> = ({ route }) => {
  const { theme } = useAppTheme();
  const { timeline } = useDeviceLocation(route.params.deviceId);

  const renderItem = ({ item, index }: { item: LocationPoint; index: number }) => (
    <View style={styles.row}>
      <View style={styles.timelineCol}>
        <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
        {index < timeline.length - 1 ? <View style={[styles.line, { backgroundColor: theme.border }]} /> : null}
      </View>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Text style={[styles.label, { color: theme.text }]}>{item.label ?? 'Unnamed location'}</Text>
        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {new Date(item.recordedAt).toLocaleString()}
        </Text>
        <Text style={[styles.coords, { color: theme.textSecondary }]}>
          {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
          {item.accuracyMeters ? ` · ±${item.accuracyMeters}m` : ''}
        </Text>
        {item.batteryAtCapture != null ? (
          <Text style={[styles.battery, { color: theme.textSecondary }]}>
            Battery at capture: {item.batteryAtCapture}%
          </Text>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={timeline}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            No location history yet for this device.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  row: { flexDirection: 'row' },
  timelineCol: { alignItems: 'center', width: 20, marginRight: Spacing.sm },
  dot: { width: 10, height: 10, borderRadius: Radius.full, marginTop: 6 },
  line: { width: 2, flex: 1, marginTop: 2 },
  card: { flex: 1, borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  label: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  time: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  coords: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  battery: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  empty: { textAlign: 'center', fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xl },
});

export default MovementHistoryScreen;

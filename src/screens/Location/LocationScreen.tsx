import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DevicesStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useDeviceLocation } from '@hooks/useDeviceLocation';

type Props = NativeStackScreenProps<DevicesStackParamList, 'Location'>;

const LocationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useAppTheme();
  const { deviceId } = route.params;
  const {
    lastKnownLocation,
    safeZones,
    isLiveTrackingEnabled,
    setLiveTrackingEnabled,
  } = useDeviceLocation(deviceId);

  if (!lastKnownLocation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No location data yet for this device.</Text>
      </View>
    );
  }

  const region = {
    latitude: lastKnownLocation.latitude,
    longitude: lastKnownLocation.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <MapView style={styles.map} initialRegion={region}>
        <Marker
          coordinate={lastKnownLocation}
          title={lastKnownLocation.label ?? 'Last known location'}
          description={new Date(lastKnownLocation.recordedAt).toLocaleString()}
          pinColor={Colors.primary}
        />
        {safeZones.map(zone => (
          <Circle
            key={zone.id}
            center={zone}
            radius={zone.radiusMeters}
            strokeColor={Colors.primary}
            fillColor={`${Colors.primary}22`}
          />
        ))}
      </MapView>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
        <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {lastKnownLocation.label ?? 'Last known location'}
          </Text>
          <Text style={[styles.cardSub, { color: theme.textSecondary }]}>
            Updated {new Date(lastKnownLocation.recordedAt).toLocaleString()}
            {lastKnownLocation.accuracyMeters ? ` · ±${lastKnownLocation.accuracyMeters}m` : ''}
          </Text>

          <View style={styles.liveRow}>
            <View>
              <Text style={[styles.liveTitle, { color: theme.text }]}>Live Location</Text>
              <Text style={[styles.liveSub, { color: theme.textSecondary }]}>
                Continuously updates only while this is on.
              </Text>
            </View>
            <Switch
              value={isLiveTrackingEnabled}
              onValueChange={setLiveTrackingEnabled}
              trackColor={{ false: theme.border, true: Colors.primary }}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.linkCard, { backgroundColor: theme.surface }, Shadow.soft]}
          onPress={() => navigation.navigate('SafeZones', { deviceId })}
          activeOpacity={0.85}>
          <Text style={[styles.linkText, { color: theme.text }]}>Safe Zones &amp; Geofencing</Text>
          <Text style={[styles.linkArrow, { color: Colors.primary }]}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.linkCard, { backgroundColor: theme.surface }, Shadow.soft]}
          onPress={() => navigation.navigate('MovementHistory', { deviceId })}
          activeOpacity={0.85}>
          <Text style={[styles.linkText, { color: theme.text }]}>Location Timeline</Text>
          <Text style={[styles.linkArrow, { color: Colors.primary }]}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '45%' },
  panel: { flex: 1 },
  panelContent: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  cardTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg },
  cardSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  liveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#88888833',
  },
  liveTitle: { fontFamily: FontFamily.medium, fontSize: FontSize.base },
  liveSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2, maxWidth: 220 },
  linkCard: {
    borderRadius: Radius.card,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  linkText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  linkArrow: { fontSize: FontSize.xl, fontFamily: FontFamily.bold },
});

export default LocationScreen;

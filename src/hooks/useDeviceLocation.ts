import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_LOCATION_TIMELINE, MOCK_SAFE_ZONES, SafeZone } from '@models/Location';
import {
  addSafeZoneRemote,
  fetchLocationTimeline,
  fetchSafeZones,
  removeSafeZoneRemote,
  setLiveTrackingRemote,
} from '@services/locationService';
import { useAuthUser } from '@hooks/useAuthUser';

/**
 * Location data for a single device. Backed by Firestore via
 * locationService when signed in; falls back to mock data otherwise.
 * Live tracking is a remote flag the device's background service watches —
 * toggling it here only requests the change, it doesn't track locally.
 */
export const useDeviceLocation = (deviceId: string) => {
  const { uid } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: timeline = MOCK_LOCATION_TIMELINE } = useQuery({
    queryKey: ['locationTimeline', uid, deviceId],
    queryFn: () => fetchLocationTimeline(uid as string, deviceId),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_LOCATION_TIMELINE,
  });

  const { data: safeZones = MOCK_SAFE_ZONES } = useQuery({
    queryKey: ['safeZones', uid, deviceId],
    queryFn: () => fetchSafeZones(uid as string, deviceId),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_SAFE_ZONES,
  });

  const addZoneMutation = useMutation({
    mutationFn: (zone: Omit<SafeZone, 'id'>) => (uid ? addSafeZoneRemote(uid, deviceId, zone) : Promise.resolve()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['safeZones', uid, deviceId] }),
  });

  const removeZoneMutation = useMutation({
    mutationFn: (zoneId: string) => (uid ? removeSafeZoneRemote(uid, deviceId, zoneId) : Promise.resolve()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['safeZones', uid, deviceId] }),
  });

  const [isLiveTrackingEnabled, setIsLiveTrackingEnabledLocal] = useState(false);

  const liveTrackingMutation = useMutation({
    mutationFn: (enabled: boolean) => (uid ? setLiveTrackingRemote(uid, deviceId, enabled) : Promise.resolve()),
  });

  const setLiveTrackingEnabled = (enabled: boolean) => {
    setIsLiveTrackingEnabledLocal(enabled);
    liveTrackingMutation.mutate(enabled);
  };

  const lastKnownLocation = useMemo(() => timeline[0] ?? null, [timeline]);

  const toggleZoneAlert = (id: string, key: 'alertOnEntry' | 'alertOnExit') => {
    const zone = safeZones.find(z => z.id === id);
    if (!zone) return;
    // Remove + re-add is a simple way to update via the current service API;
    // replace with a dedicated update function once zones are edited more often.
    removeZoneMutation.mutate(id);
    addZoneMutation.mutate({ ...zone, [key]: !zone[key] });
  };

  return {
    lastKnownLocation,
    timeline,
    safeZones,
    isLiveTrackingEnabled,
    setLiveTrackingEnabled,
    addSafeZone: (zone: Omit<SafeZone, 'id'>) => addZoneMutation.mutate(zone),
    removeSafeZone: (id: string) => removeZoneMutation.mutate(id),
    toggleZoneAlert,
  };
};

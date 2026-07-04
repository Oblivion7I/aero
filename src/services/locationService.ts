import firestore from '@react-native-firebase/firestore';
import { LocationPoint, SafeZone } from '@models/Location';

/**
 * Firestore-backed location data. Mirrors src/hooks/useDeviceLocation.ts.
 * Collections:
 *   users/{uid}/devices/{deviceId}/locationHistory/{pointId}  (written by device via native background service)
 *   users/{uid}/devices/{deviceId}/safeZones/{zoneId}
 */
const deviceDoc = (uid: string, deviceId: string) =>
  firestore().collection('users').doc(uid).collection('devices').doc(deviceId);

export const fetchLocationTimeline = async (uid: string, deviceId: string): Promise<LocationPoint[]> => {
  const snap = await deviceDoc(uid, deviceId).collection('locationHistory').orderBy('recordedAt', 'desc').limit(50).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as LocationPoint);
};

export const subscribeToLastKnownLocation = (
  uid: string,
  deviceId: string,
  onChange: (point: LocationPoint | null) => void,
): (() => void) =>
  deviceDoc(uid, deviceId)
    .collection('locationHistory')
    .orderBy('recordedAt', 'desc')
    .limit(1)
    .onSnapshot(snap => {
      const doc = snap.docs[0];
      onChange(doc ? ({ id: doc.id, ...doc.data() } as LocationPoint) : null);
    });

export const fetchSafeZones = async (uid: string, deviceId: string): Promise<SafeZone[]> => {
  const snap = await deviceDoc(uid, deviceId).collection('safeZones').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as SafeZone);
};

export const addSafeZoneRemote = async (uid: string, deviceId: string, zone: Omit<SafeZone, 'id'>): Promise<void> => {
  await deviceDoc(uid, deviceId).collection('safeZones').add(zone);
};

export const removeSafeZoneRemote = async (uid: string, deviceId: string, zoneId: string): Promise<void> => {
  await deviceDoc(uid, deviceId).collection('safeZones').doc(zoneId).delete();
};

export const setLiveTrackingRemote = async (uid: string, deviceId: string, enabled: boolean): Promise<void> => {
  // Writes a flag the device's background service polls/subscribes to.
  await deviceDoc(uid, deviceId).set({ isLiveTrackingEnabled: enabled }, { merge: true });
};

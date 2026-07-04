import firestore from '@react-native-firebase/firestore';
import { LostModeConfig } from '@models/LostMode';

/**
 * Firestore-backed Lost Mode config. Mirrors src/hooks/useLostMode.ts.
 * Document: users/{uid}/devices/{deviceId}/lostMode/config
 * The device's native layer subscribes to this document to show the
 * lock-screen message and trigger alarm/flashlight while isActive is true.
 */
const configDoc = (uid: string, deviceId: string) =>
  firestore().collection('users').doc(uid).collection('devices').doc(deviceId).collection('lostMode').doc('config');

export const fetchLostModeConfig = async (uid: string, deviceId: string): Promise<LostModeConfig | null> => {
  const doc = await configDoc(uid, deviceId).get();
  return doc.exists ? (doc.data() as LostModeConfig) : null;
};

export const subscribeLostModeConfig = (
  uid: string,
  deviceId: string,
  onChange: (config: LostModeConfig | null) => void,
): (() => void) =>
  configDoc(uid, deviceId).onSnapshot(doc => onChange(doc.exists ? (doc.data() as LostModeConfig) : null));

export const updateLostModeConfig = async (
  uid: string,
  deviceId: string,
  fields: Partial<LostModeConfig>,
): Promise<void> => {
  await configDoc(uid, deviceId).set(fields, { merge: true });
};

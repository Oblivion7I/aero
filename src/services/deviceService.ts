import firestore from '@react-native-firebase/firestore';
import { Device } from '@models/Device';

/**
 * Firestore-backed device service. Data shape mirrors `Device` in
 * src/models/Device.ts. Documents live at:
 *   users/{uid}/devices/{deviceId}
 *
 * This service is not wired into any screen yet — `useDevices` still returns
 * mock data. To switch a screen over, replace the hook's internal useState
 * with a React Query `useQuery`/`useMutation` pair that calls these
 * functions, keeping the same return shape so screens don't need changes.
 */

const devicesCollection = (uid: string) => firestore().collection('users').doc(uid).collection('devices');

export const fetchDevices = async (uid: string): Promise<Device[]> => {
  const snapshot = await devicesCollection(uid).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Device);
};

export const subscribeToDevices = (
  uid: string,
  onChange: (devices: Device[]) => void,
): (() => void) =>
  devicesCollection(uid).onSnapshot(snapshot => {
    onChange(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Device));
  });

export const upsertDevice = async (uid: string, device: Device): Promise<void> => {
  await devicesCollection(uid).doc(device.id).set(device, { merge: true });
};

export const updateDeviceFields = async (
  uid: string,
  deviceId: string,
  fields: Partial<Device>,
): Promise<void> => {
  await devicesCollection(uid).doc(deviceId).update(fields);
};

export const deleteDevice = async (uid: string, deviceId: string): Promise<void> => {
  await devicesCollection(uid).doc(deviceId).delete();
};

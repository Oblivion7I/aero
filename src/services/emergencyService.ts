import firestore from '@react-native-firebase/firestore';
import { MedicalInfo } from '@models/Emergency';

/** Firestore-backed medical info. Document: users/{uid}/emergency/medicalInfo */
const medicalInfoDoc = (uid: string) => firestore().collection('users').doc(uid).collection('emergency').doc('medicalInfo');

export const fetchMedicalInfo = async (uid: string): Promise<MedicalInfo | null> => {
  const doc = await medicalInfoDoc(uid).get();
  return doc.exists ? (doc.data() as MedicalInfo) : null;
};

export const updateMedicalInfo = async (uid: string, fields: Partial<MedicalInfo>): Promise<void> => {
  await medicalInfoDoc(uid).set(fields, { merge: true });
};

/**
 * SOS trigger — writes an event Cloud Functions can react to (call/SMS
 * emergency contacts, share last known location). The actual calling/SMS
 * happens server-side or via a native module; this only records the request.
 */
export const triggerSOSRemote = async (uid: string, deviceId: string): Promise<void> => {
  await firestore().collection('users').doc(uid).collection('sosEvents').add({
    deviceId,
    triggeredAt: firestore.FieldValue.serverTimestamp(),
  });
};

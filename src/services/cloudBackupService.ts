import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { BackupRecord } from '@models/CloudBackup';

/**
 * Firestore + Storage backed Cloud Backup.
 * Metadata: users/{uid}/backups/{id}
 * Encrypted payload: gs://.../backups/{uid}/{id}.enc (upload via Storage SDK
 * after client-side encryption — see SECURITY > Encrypted Local Storage).
 */
const backupsCollection = (uid: string) => firestore().collection('users').doc(uid).collection('backups');

export const fetchBackups = async (uid: string): Promise<BackupRecord[]> => {
  const snap = await backupsCollection(uid).orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as BackupRecord);
};

export const recordBackup = async (uid: string, record: Omit<BackupRecord, 'id'>): Promise<void> => {
  await backupsCollection(uid).add(record);
};

/** Uploads an already-encrypted payload and records its metadata. */
export const uploadEncryptedBackup = async (
  uid: string,
  id: string,
  encryptedData: string,
  meta: Omit<BackupRecord, 'id'>,
): Promise<void> => {
  const ref = storage().ref(`backups/${uid}/${id}.enc`);
  await ref.putString(encryptedData, 'base64');
  await backupsCollection(uid).doc(id).set(meta);
};

/** Downloads the raw encrypted payload for a backup so it can be decrypted client-side. */
export const downloadEncryptedBackup = async (uid: string, id: string): Promise<string> => {
  const ref = storage().ref(`backups/${uid}/${id}.enc`);
  return ref.getString('base64');
};

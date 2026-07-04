import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';

/**
 * Client-side encryption for Cloud Backup payloads (see SECURITY >
 * Encrypted Local Storage / Encrypted API Communication in the spec).
 *
 * The backup encryption key is generated once per device and stored in the
 * Android Keystore via react-native-keychain — never sent to the server,
 * never stored alongside the encrypted backup itself. Losing this key means
 * losing the ability to restore old backups, which is the expected
 * trade-off for true end-to-end encryption.
 */

const KEYCHAIN_SERVICE = 'aero.backup.encryptionKey';

const getOrCreateBackupKey = async (): Promise<string> => {
  const existing = await Keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
  if (existing) {
    return existing.password;
  }
  const newKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
  await Keychain.setGenericPassword('aero-backup-key', newKey, { service: KEYCHAIN_SERVICE });
  return newKey;
};

export const encryptBackupPayload = async (payload: unknown): Promise<string> => {
  const key = await getOrCreateBackupKey();
  const json = JSON.stringify(payload);
  return CryptoJS.AES.encrypt(json, key).toString();
};

export const decryptBackupPayload = async <T = unknown>(encrypted: string): Promise<T> => {
  const key = await getOrCreateBackupKey();
  const bytes = CryptoJS.AES.decrypt(encrypted, key);
  const json = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(json) as T;
};

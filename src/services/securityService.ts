import firestore from '@react-native-firebase/firestore';
import { PermissionGrant, SessionInfo, SecurityEvent } from '@models/Security';

/**
 * Firestore-backed security data. Mirrors src/hooks/useSecurityCenter.ts.
 * Collections:
 *   users/{uid}/permissions/{permissionId}
 *   users/{uid}/sessions/{sessionId}
 *   users/{uid}/securityEvents/{eventId}   (write via Cloud Function on real events)
 */
const userDoc = (uid: string) => firestore().collection('users').doc(uid);

export const fetchPermissions = async (uid: string): Promise<PermissionGrant[]> => {
  const snap = await userDoc(uid).collection('permissions').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as PermissionGrant);
};

export const setPermissionGranted = async (uid: string, id: string, granted: boolean): Promise<void> => {
  await userDoc(uid).collection('permissions').doc(id).set({ granted }, { merge: true });
};

export const fetchSessions = async (uid: string): Promise<SessionInfo[]> => {
  const snap = await userDoc(uid).collection('sessions').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as SessionInfo);
};

export const revokeSessionRemote = async (uid: string, sessionId: string): Promise<void> => {
  await userDoc(uid).collection('sessions').doc(sessionId).delete();
};

export const fetchSecurityEvents = async (uid: string): Promise<SecurityEvent[]> => {
  const snap = await userDoc(uid).collection('securityEvents').orderBy('occurredAt', 'desc').limit(50).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }) as SecurityEvent);
};

import firestore from '@react-native-firebase/firestore';
import { AppNotification } from '@models/Notification';

/**
 * Firestore-backed notifications. Mirrors src/hooks/useNotifications.ts.
 * Collection: users/{uid}/notifications/{id}
 * Cloud Functions write here in response to device/security events; the
 * Messaging module (@react-native-firebase/messaging) delivers the push.
 */
const notificationsCollection = (uid: string) =>
  firestore().collection('users').doc(uid).collection('notifications');

export const subscribeToNotifications = (
  uid: string,
  onChange: (notifications: AppNotification[]) => void,
): (() => void) =>
  notificationsCollection(uid)
    .orderBy('occurredAt', 'desc')
    .limit(100)
    .onSnapshot(snap => onChange(snap.docs.map(d => ({ id: d.id, ...d.data() }) as AppNotification)));

export const markNotificationRead = async (uid: string, id: string): Promise<void> => {
  await notificationsCollection(uid).doc(id).update({ read: true });
};

export const markAllNotificationsRead = async (uid: string, ids: string[]): Promise<void> => {
  const batch = firestore().batch();
  ids.forEach(id => batch.update(notificationsCollection(uid).doc(id), { read: true }));
  await batch.commit();
};

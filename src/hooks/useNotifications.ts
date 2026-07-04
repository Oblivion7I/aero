import { useEffect, useMemo, useState } from 'react';
import { AppNotification, MOCK_NOTIFICATIONS } from '@models/Notification';
import { markAllNotificationsRead, markNotificationRead, subscribeToNotifications } from '@services/notificationService';
import { useAuthUser } from '@hooks/useAuthUser';

/**
 * Notification feed. Subscribes to Firestore in real time when signed in
 * (so a push-triggered write shows up immediately); falls back to mock data
 * otherwise.
 */
export const useNotifications = () => {
  const { uid } = useAuthUser();
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  useEffect(() => {
    if (!uid) {
      setNotifications(MOCK_NOTIFICATIONS);
      return;
    }
    const unsubscribe = subscribeToNotifications(uid, setNotifications);
    return unsubscribe;
  }, [uid]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const markAsRead = (id: string) => {
    if (uid) {
      markNotificationRead(uid, id);
    } else {
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    }
  };

  const markAllAsRead = () => {
    if (uid) {
      markAllNotificationsRead(uid, notifications.filter(n => !n.read).map(n => n.id));
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  return { notifications, unreadCount, markAsRead, markAllAsRead };
};

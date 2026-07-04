export type NotificationType =
  | 'battery_low'
  | 'charging_started'
  | 'charging_removed'
  | 'device_online'
  | 'device_offline'
  | 'location_updated'
  | 'permission_revoked'
  | 'security_alert'
  | 'login_alert'
  | 'device_registered'
  | 'backup_completed';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  occurredAt: string;
  read: boolean;
}

export const NOTIFICATION_ICON: Record<NotificationType, string> = {
  battery_low: '🔋',
  charging_started: '⚡',
  charging_removed: '🔌',
  device_online: '🟢',
  device_offline: '⚪',
  location_updated: '📍',
  permission_revoked: '🔒',
  security_alert: '⚠️',
  login_alert: '🔐',
  device_registered: '📱',
  backup_completed: '☁️',
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    type: 'security_alert',
    title: 'New sign-in detected',
    body: 'A new sign-in to your account was detected from Dhaka, Bangladesh.',
    occurredAt: new Date().toISOString(),
    read: false,
  },
  {
    id: 'n-2',
    type: 'battery_low',
    title: 'Battery low on Work Tablet',
    body: 'Battery is at 15%. Consider charging soon.',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: 'n-3',
    type: 'backup_completed',
    title: 'Cloud backup completed',
    body: "Arafat's Pixel was backed up successfully.",
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    read: true,
  },
  {
    id: 'n-4',
    type: 'device_offline',
    title: 'Work Tablet went offline',
    body: 'Last seen 5 hours ago.',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
];

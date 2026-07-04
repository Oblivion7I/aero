/**
 * Domain models for the Security Center module.
 */

export interface PermissionGrant {
  id: string;
  title: string;
  why: string;
  enabledFeatures: string;
  granted: boolean;
}

export interface SessionInfo {
  id: string;
  deviceName: string;
  location: string;
  lastActiveAt: string; // ISO timestamp
  isCurrentSession: boolean;
}

export type SecurityEventType =
  | 'login'
  | 'password_change'
  | 'permission_change'
  | 'device_registered'
  | 'security_alert';

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  description: string;
  occurredAt: string; // ISO timestamp
  location?: string;
}

/** Same permission set offered during Owner Verification — re-shown here so they can be revoked. */
export const MOCK_PERMISSIONS: PermissionGrant[] = [
  {
    id: 'location',
    title: 'Location Access',
    why: "Used to show this device's last known position on the map.",
    enabledFeatures: 'Live Location, Lost Mode, Safe Zones',
    granted: true,
  },
  {
    id: 'device_admin',
    title: 'Device Administrator',
    why: 'Required so you can lock or wipe this device remotely if it is lost.',
    enabledFeatures: 'Lost Mode, Remote Lock, Remote Wipe',
    granted: true,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    why: 'Lets Aero alert you about battery, security, and login events.',
    enabledFeatures: 'Security Alerts, Battery Alerts, Login Alerts',
    granted: true,
  },
  {
    id: 'storage',
    title: 'Storage Access',
    why: 'Used only to report storage usage on your dashboard — files are never uploaded.',
    enabledFeatures: 'Storage Report, Device Health',
    granted: false,
  },
];

export const MOCK_SESSIONS: SessionInfo[] = [
  {
    id: 'session-1',
    deviceName: "Arafat's Pixel",
    location: 'Dhaka, Bangladesh',
    lastActiveAt: new Date().toISOString(),
    isCurrentSession: true,
  },
  {
    id: 'session-2',
    deviceName: 'Work Tablet',
    location: 'Dhaka, Bangladesh',
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isCurrentSession: false,
  },
];

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'evt-1',
    type: 'login',
    description: 'Signed in with Google',
    occurredAt: new Date().toISOString(),
    location: 'Dhaka, Bangladesh',
  },
  {
    id: 'evt-2',
    type: 'permission_change',
    description: 'Storage Access permission revoked',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'evt-3',
    type: 'device_registered',
    description: "Registered device 'Work Tablet'",
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'evt-4',
    type: 'password_change',
    description: 'Account password changed',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
];

/** Simple weighted score from granted permissions, active sessions hygiene, and 2FA (stubbed true). */
export const computeSecurityScore = (
  permissions: PermissionGrant[],
  sessions: SessionInfo[],
): number => {
  const criticalGranted = permissions.filter(p => p.granted).length;
  const permissionScore = (criticalGranted / Math.max(permissions.length, 1)) * 50;
  const sessionScore = sessions.length <= 2 ? 30 : 15;
  const twoFactorScore = 20; // TODO: replace with real 2FA status once Authentication is wired up
  return Math.round(permissionScore + sessionScore + twoFactorScore);
};

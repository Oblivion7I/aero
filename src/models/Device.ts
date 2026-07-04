/**
 * Domain model for a managed device, plus small pure helpers.
 * Mirrors `DeviceInfo` in the device redux slice, with extra fields
 * needed for the Device Management / Device Details / Device Health screens.
 */

export type DeviceStatus = 'online' | 'offline' | 'lost';

export interface Device {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  androidVersion: string;
  status: DeviceStatus;

  batteryLevel: number; // 0-100
  isCharging: boolean;

  storageUsedGb: number;
  storageTotalGb: number;

  ramUsedGb: number;
  ramTotalGb: number;

  network: 'wifi' | 'mobile' | 'offline';
  bluetoothEnabled: boolean;
  wifiEnabled: boolean;

  securityScore: number; // 0-100
  lastSeenAt: string; // ISO timestamp
  group?: string;
  notes?: string;
}

export const getStorageFreeGb = (device: Device): number =>
  Math.max(0, device.storageTotalGb - device.storageUsedGb);

export const getStoragePercentUsed = (device: Device): number =>
  device.storageTotalGb === 0 ? 0 : Math.round((device.storageUsedGb / device.storageTotalGb) * 100);

export const getRamPercentUsed = (device: Device): number =>
  device.ramTotalGb === 0 ? 0 : Math.round((device.ramUsedGb / device.ramTotalGb) * 100);

export const getHealthLabel = (device: Device): 'Excellent' | 'Good' | 'Needs Attention' => {
  if (device.securityScore >= 85 && device.batteryLevel >= 20) return 'Excellent';
  if (device.securityScore >= 60) return 'Good';
  return 'Needs Attention';
};

/** Mock devices used until the API/native layer is wired up. */
export const MOCK_DEVICES: Device[] = [
  {
    id: 'device-1',
    name: "Arafat's Pixel",
    model: 'Pixel 8',
    manufacturer: 'Google',
    androidVersion: '14',
    status: 'online',
    batteryLevel: 82,
    isCharging: false,
    storageUsedGb: 74,
    storageTotalGb: 128,
    ramUsedGb: 3.1,
    ramTotalGb: 8,
    network: 'wifi',
    bluetoothEnabled: true,
    wifiEnabled: true,
    securityScore: 92,
    lastSeenAt: new Date().toISOString(),
    group: 'Personal',
  },
  {
    id: 'device-2',
    name: 'Work Tablet',
    model: 'Galaxy Tab S9',
    manufacturer: 'Samsung',
    androidVersion: '13',
    status: 'offline',
    batteryLevel: 41,
    isCharging: false,
    storageUsedGb: 102,
    storageTotalGb: 256,
    ramUsedGb: 5.4,
    ramTotalGb: 12,
    network: 'offline',
    bluetoothEnabled: false,
    wifiEnabled: true,
    securityScore: 68,
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    group: 'Work',
  },
];

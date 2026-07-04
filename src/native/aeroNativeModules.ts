import { NativeModules, Platform } from 'react-native';

/**
 * Thin, typed wrapper around the native modules defined in
 * android/app/src/main/java/com/afmtechnologies/aero/modules/. Every
 * function here is a no-op (resolves to false) on platforms other than
 * Android, so calling code doesn't need its own Platform.OS checks.
 */

interface AeroAlarmModuleType {
  startAlarm(): Promise<boolean>;
  stopAlarm(): Promise<boolean>;
  startFlashlightSos(): Promise<boolean>;
  stopFlashlightSos(): Promise<boolean>;
}

interface AeroEmergencyModuleType {
  callNumber(phoneNumber: string): Promise<boolean>;
  sendSms(phoneNumber: string, message: string): Promise<boolean>;
}

const isAndroid = Platform.OS === 'android';

const AlarmModule: AeroAlarmModuleType | null = isAndroid
  ? (NativeModules.AeroAlarmModule as AeroAlarmModuleType)
  : null;

const EmergencyModule: AeroEmergencyModuleType | null = isAndroid
  ? (NativeModules.AeroEmergencyModule as AeroEmergencyModuleType)
  : null;

export const startLostModeAlarm = (): Promise<boolean> => AlarmModule?.startAlarm() ?? Promise.resolve(false);
export const stopLostModeAlarm = (): Promise<boolean> => AlarmModule?.stopAlarm() ?? Promise.resolve(false);
export const startFlashlightSos = (): Promise<boolean> => AlarmModule?.startFlashlightSos() ?? Promise.resolve(false);
export const stopFlashlightSos = (): Promise<boolean> => AlarmModule?.stopFlashlightSos() ?? Promise.resolve(false);

export const callEmergencyNumber = (phoneNumber: string): Promise<boolean> =>
  EmergencyModule?.callNumber(phoneNumber) ?? Promise.resolve(false);

export const sendEmergencySms = (phoneNumber: string, message: string): Promise<boolean> =>
  EmergencyModule?.sendSms(phoneNumber, message) ?? Promise.resolve(false);

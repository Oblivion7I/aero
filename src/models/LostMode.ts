/**
 * Domain model for a device's Lost Mode configuration.
 *
 * Lost Mode is strictly owner-initiated: the device owner turns it on for
 * their own device when it's lost, and turns it off when it's found. While
 * active it shows a message + contact info on the lock screen, can sound a
 * loud alarm, flash the LED/torch in an SOS pattern, and enables continuous
 * location updates — but ONLY while Lost Mode is active and the underlying
 * permissions remain granted (see OwnerVerificationScreen).
 */

export interface LostModeConfig {
  isActive: boolean;
  activatedAt: string | null;

  ownerMessage: string;
  contactNumber: string;
  contactEmail: string;
  rewardMessage: string;

  alarmEnabled: boolean;
  flashlightSosEnabled: boolean;
}

export const DEFAULT_LOST_MODE_CONFIG: LostModeConfig = {
  isActive: false,
  activatedAt: null,
  ownerMessage: 'This device is lost. Please contact the owner using the details below.',
  contactNumber: '',
  contactEmail: '',
  rewardMessage: '',
  alarmEnabled: true,
  flashlightSosEnabled: true,
};

/** Builds the payload encoded into the QR Recovery Card. */
export const buildRecoveryCardPayload = (config: LostModeConfig, deviceName: string): string =>
  JSON.stringify({
    device: deviceName,
    message: config.ownerMessage,
    phone: config.contactNumber || undefined,
    email: config.contactEmail || undefined,
    reward: config.rewardMessage || undefined,
  });

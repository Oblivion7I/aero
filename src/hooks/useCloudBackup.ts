import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_BACKUPS } from '@models/CloudBackup';
import { downloadEncryptedBackup, fetchBackups, uploadEncryptedBackup } from '@services/cloudBackupService';
import { upsertDevice } from '@services/deviceService';
import { useAuthUser } from '@hooks/useAuthUser';
import { decryptBackupPayload, encryptBackupPayload } from '@utils/backupEncryption';
import { useDevices } from '@hooks/useDevices';
import type { Device } from '@models/Device';

interface BackupPayload {
  devices: Device[];
  backedUpAt: string;
}

export const useCloudBackup = () => {
  const { uid } = useAuthUser();
  const queryClient = useQueryClient();
  const queryKey = ['backups', uid];
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const { devices } = useDevices();

  const { data: backups = MOCK_BACKUPS } = useQuery({
    queryKey,
    queryFn: () => fetchBackups(uid as string),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_BACKUPS,
  });

  const backupMutation = useMutation({
    mutationFn: async () => {
      if (!uid) return;
      // Settings + device list are what gets backed up today; expand this
      // payload as more user-configurable state is added.
      const payload: BackupPayload = { devices, backedUpAt: new Date().toISOString() };
      const encrypted = await encryptBackupPayload(payload);
      const id = `backup-${Date.now()}`;
      const sizeMb = Math.max(1, Math.round(encrypted.length / (1024 * 1024)));
      await uploadEncryptedBackup(uid, id, encrypted, {
        label: 'Full backup',
        createdAt: new Date().toISOString(),
        sizeMb,
        type: 'full',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const runBackupNow = () => {
    setIsSyncing(true);
    backupMutation.mutate(undefined, { onSettled: () => setIsSyncing(false) });
  };

  /**
   * Downloads and decrypts a backup, then writes each device back to
   * Firestore (where `useDevices` reads from) and refreshes the cache.
   * Callers should confirm with the user first since this overwrites
   * current device data — see CloudBackupScreen's restore button.
   */
  const restoreBackup = async (id: string) => {
    if (!uid) return;
    setIsRestoring(id);
    try {
      const encrypted = await downloadEncryptedBackup(uid, id);
      const payload = await decryptBackupPayload<BackupPayload>(encrypted);
      await Promise.all(payload.devices.map(device => upsertDevice(uid, device)));
      await queryClient.invalidateQueries({ queryKey: ['devices', uid] });
    } finally {
      setIsRestoring(null);
    }
  };

  return { backups, isSyncing, isRestoring, runBackupNow, restoreBackup };
};

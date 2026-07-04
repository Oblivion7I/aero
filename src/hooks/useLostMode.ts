import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_LOST_MODE_CONFIG, LostModeConfig } from '@models/LostMode';
import { fetchLostModeConfig, updateLostModeConfig } from '@services/lostModeService';
import { useAuthUser } from '@hooks/useAuthUser';
import {
  startFlashlightSos,
  startLostModeAlarm,
  stopFlashlightSos,
  stopLostModeAlarm,
} from '@native/aeroNativeModules';

/**
 * Lost Mode state for a single device. Backed by Firestore via
 * lostModeService when signed in; falls back to local defaults otherwise.
 */
export const useLostMode = (deviceId: string) => {
  const { uid } = useAuthUser();
  const queryClient = useQueryClient();
  const queryKey = ['lostMode', uid, deviceId];

  const { data: config = DEFAULT_LOST_MODE_CONFIG } = useQuery({
    queryKey,
    queryFn: async () => (await fetchLostModeConfig(uid as string, deviceId)) ?? DEFAULT_LOST_MODE_CONFIG,
    enabled: !!uid,
    initialData: uid ? undefined : DEFAULT_LOST_MODE_CONFIG,
  });

  const updateMutation = useMutation({
    mutationFn: (fields: Partial<LostModeConfig>) =>
      uid ? updateLostModeConfig(uid, deviceId, fields) : Promise.resolve(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateField = useCallback(
    <K extends keyof LostModeConfig>(key: K, value: LostModeConfig[K]) => {
      updateMutation.mutate({ [key]: value } as Partial<LostModeConfig>);
    },
    [updateMutation],
  );

  const activate = useCallback(() => {
    updateMutation.mutate({ isActive: true, activatedAt: new Date().toISOString() });
  }, [updateMutation]);

  const deactivate = useCallback(() => {
    updateMutation.mutate({ isActive: false, activatedAt: null });
  }, [updateMutation]);

  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [isFlashlightActive, setIsFlashlightActive] = useState(false);

  const triggerAlarm = useCallback(async () => {
    if (isAlarmPlaying) {
      await stopLostModeAlarm();
      setIsAlarmPlaying(false);
    } else {
      await startLostModeAlarm();
      setIsAlarmPlaying(true);
    }
  }, [isAlarmPlaying]);

  const triggerFlashlightSos = useCallback(async () => {
    if (isFlashlightActive) {
      await stopFlashlightSos();
      setIsFlashlightActive(false);
    } else {
      await startFlashlightSos();
      setIsFlashlightActive(true);
    }
  }, [isFlashlightActive]);

  return {
    config,
    updateField,
    activate,
    deactivate,
    triggerAlarm,
    triggerFlashlightSos,
    isAlarmPlaying,
    isFlashlightActive,
  };
};

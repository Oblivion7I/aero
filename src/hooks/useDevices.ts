import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Device, MOCK_DEVICES } from '@models/Device';
import { deleteDevice, fetchDevices, updateDeviceFields } from '@services/deviceService';
import { useAuthUser } from '@hooks/useAuthUser';

/**
 * Provides the device list and basic mutations (rename, delete, set notes/group).
 * Backed by Firestore via deviceService when signed in; falls back to mock
 * data when signed out (e.g. during local development without a configured
 * Firebase project) so screens keep working either way.
 */
export const useDevices = () => {
  const { uid } = useAuthUser();
  const queryClient = useQueryClient();
  const queryKey = ['devices', uid];

  const { data: devices = MOCK_DEVICES } = useQuery({
    queryKey,
    queryFn: () => fetchDevices(uid as string),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_DEVICES,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const updateFieldsMutation = useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<Device> }) =>
      uid ? updateDeviceFields(uid, id, fields) : Promise.resolve(),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => (uid ? deleteDevice(uid, id) : Promise.resolve()),
    onSuccess: invalidate,
  });

  const getDevice = useCallback((id: string) => devices.find(d => d.id === id), [devices]);

  const renameDevice = useCallback(
    (id: string, name: string) => updateFieldsMutation.mutate({ id, fields: { name } }),
    [updateFieldsMutation],
  );

  const setDeviceGroup = useCallback(
    (id: string, group: string) => updateFieldsMutation.mutate({ id, fields: { group } }),
    [updateFieldsMutation],
  );

  const setDeviceNotes = useCallback(
    (id: string, notes: string) => updateFieldsMutation.mutate({ id, fields: { notes } }),
    [updateFieldsMutation],
  );

  const removeDevice = useCallback((id: string) => removeMutation.mutate(id), [removeMutation]);

  const onlineCount = useMemo(() => devices.filter(d => d.status === 'online').length, [devices]);

  return {
    devices,
    onlineCount,
    getDevice,
    renameDevice,
    setDeviceGroup,
    setDeviceNotes,
    removeDevice,
  };
};

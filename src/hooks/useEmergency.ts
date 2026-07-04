import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { DEFAULT_MEDICAL_INFO, MedicalInfo } from '@models/Emergency';
import { fetchMedicalInfo, triggerSOSRemote, updateMedicalInfo } from '@services/emergencyService';
import { useAuthUser } from '@hooks/useAuthUser';
import { useTrustedContacts } from '@hooks/useTrustedContacts';
import { useDevices } from '@hooks/useDevices';
import { useDeviceLocation } from '@hooks/useDeviceLocation';
import type { RootState } from '@redux/store';
import { callEmergencyNumber, sendEmergencySms } from '@native/aeroNativeModules';

export const useEmergency = () => {
  const { uid } = useAuthUser();
  const queryClient = useQueryClient();
  const queryKey = ['medicalInfo', uid];
  const { contacts } = useTrustedContacts();
  const { devices } = useDevices();
  const currentDeviceId = useSelector((state: RootState) => state.device.currentDeviceId);
  // Falls back to the first registered device if none is explicitly marked current.
  const activeDeviceId = currentDeviceId ?? devices[0]?.id ?? null;

  const { data: medicalInfo = DEFAULT_MEDICAL_INFO } = useQuery({
    queryKey,
    queryFn: async () => (await fetchMedicalInfo(uid as string)) ?? DEFAULT_MEDICAL_INFO,
    enabled: !!uid,
    initialData: uid ? undefined : DEFAULT_MEDICAL_INFO,
  });

  const updateMutation = useMutation({
    mutationFn: (fields: Partial<MedicalInfo>) => (uid ? updateMedicalInfo(uid, fields) : Promise.resolve()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const updateField = <K extends keyof MedicalInfo>(key: K, value: MedicalInfo[K]) => {
    updateMutation.mutate({ [key]: value } as Partial<MedicalInfo>);
  };

  const emergencyContacts = contacts.filter(c => c.isEmergencyContact);
  const { lastKnownLocation } = useDeviceLocation(activeDeviceId ?? '');

  const triggerSOS = async () => {
    if (uid && activeDeviceId) {
      triggerSOSRemote(uid, activeDeviceId);
    }

    const mapsLink = lastKnownLocation
      ? `https://maps.google.com/?q=${lastKnownLocation.latitude},${lastKnownLocation.longitude}`
      : 'location unavailable';
    const message = `This is an SOS alert from Aero. Please contact me or check my location: ${mapsLink}`;

    // SMS every emergency contact; call the first one (calling all of them
    // isn't possible simultaneously on a single-SIM device).
    await Promise.all(emergencyContacts.map(c => sendEmergencySms(c.phone, message)));
    if (emergencyContacts[0]) {
      await callEmergencyNumber(emergencyContacts[0].phone);
    }
  };

  return { medicalInfo, updateField, emergencyContacts, triggerSOS };
};

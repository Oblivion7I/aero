import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MOCK_TRUSTED_CONTACTS, TrustedContact } from '@models/TrustedContacts';
import {
  addTrustedContactRemote,
  fetchTrustedContacts,
  removeTrustedContactRemote,
  updateTrustedContactRemote,
} from '@services/trustedContactsService';
import { useAuthUser } from '@hooks/useAuthUser';

export const useTrustedContacts = () => {
  const { uid } = useAuthUser();
  const queryClient = useQueryClient();
  const queryKey = ['trustedContacts', uid];

  const { data: contacts = MOCK_TRUSTED_CONTACTS } = useQuery({
    queryKey,
    queryFn: () => fetchTrustedContacts(uid as string),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_TRUSTED_CONTACTS,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const addMutation = useMutation({
    mutationFn: (contact: Omit<TrustedContact, 'id'>) =>
      uid ? addTrustedContactRemote(uid, contact) : Promise.resolve(),
    onSuccess: invalidate,
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => (uid ? removeTrustedContactRemote(uid, id) : Promise.resolve()),
    onSuccess: invalidate,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, key, value }: { id: string; key: 'isEmergencyContact' | 'canViewLocation'; value: boolean }) =>
      uid ? updateTrustedContactRemote(uid, id, { [key]: value }) : Promise.resolve(),
    onSuccess: invalidate,
  });

  const toggleField = (id: string, key: 'isEmergencyContact' | 'canViewLocation') => {
    const contact = contacts.find(c => c.id === id);
    if (contact) toggleMutation.mutate({ id, key, value: !contact[key] });
  };

  return {
    contacts,
    addContact: (contact: Omit<TrustedContact, 'id'>) => addMutation.mutate(contact),
    removeContact: (id: string) => removeMutation.mutate(id),
    toggleField,
  };
};

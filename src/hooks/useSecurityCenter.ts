import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  computeSecurityScore,
  MOCK_PERMISSIONS,
  MOCK_SECURITY_EVENTS,
  MOCK_SESSIONS,
} from '@models/Security';
import { fetchPermissions, fetchSecurityEvents, fetchSessions, revokeSessionRemote, setPermissionGranted } from '@services/securityService';
import { useAuthUser } from '@hooks/useAuthUser';

/**
 * Account-level security state: permission center, active sessions, and
 * login/security history. Backed by Firestore via securityService when
 * signed in; falls back to mock data when signed out.
 */
export const useSecurityCenter = () => {
  const { uid } = useAuthUser();
  const queryClient = useQueryClient();

  const { data: permissions = MOCK_PERMISSIONS } = useQuery({
    queryKey: ['permissions', uid],
    queryFn: () => fetchPermissions(uid as string),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_PERMISSIONS,
  });

  const { data: sessions = MOCK_SESSIONS } = useQuery({
    queryKey: ['sessions', uid],
    queryFn: () => fetchSessions(uid as string),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_SESSIONS,
  });

  const { data: events = MOCK_SECURITY_EVENTS } = useQuery({
    queryKey: ['securityEvents', uid],
    queryFn: () => fetchSecurityEvents(uid as string),
    enabled: !!uid,
    initialData: uid ? undefined : MOCK_SECURITY_EVENTS,
  });

  const togglePermissionMutation = useMutation({
    mutationFn: ({ id, granted }: { id: string; granted: boolean }) =>
      uid ? setPermissionGranted(uid, id, granted) : Promise.resolve(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions', uid] }),
  });

  const revokeSessionMutation = useMutation({
    mutationFn: (sessionId: string) => (uid ? revokeSessionRemote(uid, sessionId) : Promise.resolve()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sessions', uid] }),
  });

  const togglePermission = (id: string) => {
    const current = permissions.find(p => p.id === id);
    if (current) togglePermissionMutation.mutate({ id, granted: !current.granted });
  };

  const revokeSession = (id: string) => revokeSessionMutation.mutate(id);

  const score = useMemo(() => computeSecurityScore(permissions, sessions), [permissions, sessions]);

  return { permissions, togglePermission, sessions, revokeSession, events, score };
};

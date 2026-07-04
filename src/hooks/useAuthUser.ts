import { useSelector } from 'react-redux';
import type { RootState } from '@redux/store';

/** Convenience hook returning the current Firebase uid from Redux auth state, or null if signed out. */
export const useAuthUser = (): { uid: string | null } => {
  const userId = useSelector((state: RootState) => state.auth.userId);
  return { uid: userId };
};

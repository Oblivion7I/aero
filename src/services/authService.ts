import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

export interface AuthResult {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

const toAuthResult = (user: FirebaseAuthTypes.User): AuthResult => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  emailVerified: user.emailVerified,
});

/** Human-readable messages for the Firebase Auth error codes we expect to hit. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'An account already exists with this email.',
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/weak-password': 'Password is too weak — use at least 8 characters.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
};

export const mapAuthError = (error: unknown): string => {
  const code = (error as { code?: string })?.code;
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  return 'Something went wrong. Please try again.';
};

/**
 * One-time Google Sign-In configuration. Call this once at app startup
 * (e.g. in App.tsx) with the Web Client ID from the Firebase console.
 */
export const configureGoogleSignIn = (webClientId: string): void => {
  GoogleSignin.configure({ webClientId });
};

export const registerWithEmail = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResult> => {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  if (name) {
    await credential.user.updateProfile({ displayName: name });
  }
  await credential.user.sendEmailVerification();
  return toAuthResult(credential.user);
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  return toAuthResult(credential.user);
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { idToken } = await GoogleSignin.signIn();
  if (!idToken) {
    throw new Error('Google sign-in did not return an ID token.');
  }
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  const credential = await auth().signInWithCredential(googleCredential);
  return toAuthResult(credential.user);
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await auth().sendPasswordResetEmail(email);
};

export const signOutUser = async (): Promise<void> => {
  try {
    await GoogleSignin.signOut();
  } catch {
    // Not signed in with Google — safe to ignore.
  }
  await auth().signOut();
};

export const isGoogleSignInCancelled = (error: unknown): boolean =>
  (error as { code?: string })?.code === statusCodes.SIGN_IN_CANCELLED;

export const getCurrentUser = (): AuthResult | null => {
  const user = auth().currentUser;
  return user ? toAuthResult(user) : null;
};

export const onAuthStateChanged = (
  callback: (user: AuthResult | null) => void,
): (() => void) => auth().onAuthStateChanged(user => callback(user ? toAuthResult(user) : null));

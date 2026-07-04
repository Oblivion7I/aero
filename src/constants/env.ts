/**
 * Non-secret client-side config. Get the Web Client ID from:
 * Firebase Console → Authentication → Sign-in method → Google → Web SDK configuration.
 *
 * This value is safe to commit (it's a public client identifier, not a secret),
 * but is kept here so it's easy to swap per-environment (dev/staging/prod)
 * without touching app code.
 */
export const GOOGLE_WEB_CLIENT_ID = 'YOUR_FIREBASE_WEB_CLIENT_ID.apps.googleusercontent.com';

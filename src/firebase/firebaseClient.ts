/**
 * Firebase initialization.
 *
 * @react-native-firebase auto-initializes from android/app/google-services.json,
 * so nothing needs to be called here for the default app — this file exists as
 * a single place to import Firebase modules from, and to host any custom
 * initialization (e.g. Firestore settings, emulator connection in dev).
 *
 * Setup checklist (see docs/installation.md):
 * 1. Add android/app/google-services.json from the Firebase console.
 * 2. Apply the Google services Gradle plugin in android/build.gradle and
 *    android/app/build.gradle (see docs/developer-guide.md#firebase).
 * 3. Enable Email/Password and Google sign-in providers in Firebase Auth.
 */
import firestore from '@react-native-firebase/firestore';

// Optional: recommended Firestore settings for offline-first mobile apps.
firestore().settings({ persistence: true });

export { default as firebaseAuth } from '@react-native-firebase/auth';
export { default as firebaseFirestore } from '@react-native-firebase/firestore';
export { default as firebaseMessaging } from '@react-native-firebase/messaging';

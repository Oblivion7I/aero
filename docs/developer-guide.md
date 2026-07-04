# Developer Guide

## Architecture

Aero follows a clean, modular architecture:

- **Screens** are composition-only — they assemble components and wire up navigation/state, with minimal logic.
- **Components** are reusable and presentational; avoid embedding business logic.
- **Services** hold business/integration logic (Firebase calls, native module bridges).
- **Redux slices** hold cross-screen application state (auth session, device list).
- **React Query** handles server state, caching, and refetching for anything backend-backed.

## Native modules

Two Aero-specific native modules live in `android/app/src/main/java/com/afmtechnologies/aero/modules/`, registered via `AeroPackage` in `MainApplication.kt`, and wrapped for JS in `src/native/aeroNativeModules.ts`:

- **`AeroAlarmModule`** — Lost Mode's Loud Alarm (plays the device's alarm sound at max volume via `AudioAttributes.USAGE_ALARM`, overriding silent mode) and Flashlight SOS (pulses the camera torch in Morse SOS). Wired into `useLostMode`.
- **`AeroEmergencyModule`** — Emergency SOS's direct call (`ACTION_CALL`, not just opening the dialer) and SMS to emergency contacts. Wired into `useEmergency`, which also shares a Google Maps link to the last known location in the SMS body.

Both modules only ever run in response to an explicit user tap in JS (Lost Mode's alarm/flash buttons, Emergency's SOS button + confirmation) — nothing here runs automatically or in the background. `CALL_PHONE`, `SEND_SMS`, and `CAMERA` are declared in the manifest but still need to be requested at runtime before use, the same way as every other Aero permission (see Owner Verification).

Push notifications use `@react-native-firebase/messaging` directly (no custom native module needed): `App.tsx` requests permission and shows a foreground alert; `index.js` registers the required background handler. The actual Firestore write that populates the in-app Notifications feed happens server-side — see `notificationService.ts`.

Not yet implemented: a background location service for Lost Mode's continuous location updates (this requires a proper Android foreground `Service` + notification channel, which is a larger addition than the modules above).

## Firebase

Aero uses `@react-native-firebase` for Auth, Firestore, and Messaging.

- **Auth**: `src/services/authService.ts` wraps email/password and Google sign-in, with a shared `mapAuthError` helper for user-facing error messages. `App.tsx` subscribes to `onAuthStateChanged` on startup and syncs the session into the `auth` Redux slice.
- **Firestore**: `src/services/deviceService.ts` shows the intended pattern for backing `useDevices` with real data (`users/{uid}/devices/{deviceId}`) — swap the hook's internal `useState` for a React Query query/mutation pair that calls these functions, keeping the same return shape. The same pattern is repeated for every other module's mock hook:
  | Hook | Service | Collection path |
  |---|---|---|
  | `useDevices` | `deviceService.ts` | `users/{uid}/devices/{id}` |
  | `useSecurityCenter` | `securityService.ts` | `users/{uid}/permissions`, `/sessions`, `/securityEvents` |
  | `useDeviceLocation` | `locationService.ts` | `users/{uid}/devices/{id}/locationHistory`, `/safeZones` |
  | `useLostMode` | `lostModeService.ts` | `users/{uid}/devices/{id}/lostMode/config` |
  | `useNotifications` | `notificationService.ts` | `users/{uid}/notifications` |
  | `useTrustedContacts` | `trustedContactsService.ts` | `users/{uid}/trustedContacts` |
  | `useEmergency` | `emergencyService.ts` | `users/{uid}/emergency/medicalInfo`, `/sosEvents` |
  | `useCloudBackup` | `cloudBackupService.ts` | `users/{uid}/backups` + Storage `backups/{uid}/{id}.enc` |

  All hooks above are now wired to their service via React Query, with an automatic fallback to mock data when signed out (`enabled: !!uid` + `initialData`) — so the app runs with zero Firebase configuration during early development, and switches to real data the moment a user is authenticated.
- **Native setup**: requires `android/app/google-services.json` and the Google services Gradle plugin — see [installation.md](installation.md).
- **Google Sign-In**: configured once via `configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID)` in `App.tsx`; set the real Web Client ID in `src/constants/env.ts`.

## Adding a new module

1. Create `src/screens/<ModuleName>/`.
2. Add route(s) to `src/navigation/types.ts` and the relevant navigator.
3. Add a Redux slice in `src/redux/slices/` only if the module needs cross-screen state.
4. Add design-token-based styling only (`@constants/colors`, `@constants/typography`).
5. Write the screen as a typed functional component; export default.

## Permissions

Aero requests permissions only when a feature needs them, and always explains why first (see `OwnerVerificationScreen`). When adding a feature that needs a new Android permission:

1. Add a `PermissionItem` entry describing what it does and which features depend on it.
2. Request the permission at the point of use, not at app launch.
3. Make sure the permission can be revoked from Settings → Permissions without crashing dependent features (degrade gracefully).

## Signing

Release builds are signed via Gradle properties: `AERO_UPLOAD_STORE_FILE`, `AERO_UPLOAD_STORE_PASSWORD`, `AERO_UPLOAD_KEY_ALIAS`, `AERO_UPLOAD_KEY_PASSWORD` (declared in `android/gradle.properties` with placeholder values, and read by `android/app/build.gradle`'s `signingConfigs.release`). For CI, override them via the GitHub Actions secrets referenced in `.github/workflows/android-build.yml`. For local builds, generate a keystore (`keytool -genkeypair -v -keystore aero-release.keystore -alias aero -keyalg RSA -keysize 2048 -validity 10000`), place it at `android/app/aero-release.keystore`, and set the real passwords in a local, gitignored `android/gradle.properties` override — never commit a keystore file or its password.

## Code style

- TypeScript strict mode is enforced (`tsconfig.json`).
- ESLint (`@react-native/eslint-config`) + Prettier are enforced in CI (`npm run lint`, `npm run typecheck`).
- Prefer named, descriptive exports over default `index.ts` barrels for non-trivial modules.

## Testing

- Unit/component tests use Jest + React Native Testing Library.
- Place tests next to the file under test as `ComponentName.test.tsx`.

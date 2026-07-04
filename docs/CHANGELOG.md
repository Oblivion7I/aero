# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added
- **Owner Verification now requests real Android runtime permissions**: toggling a permission on and tapping "Confirm Ownership & Continue" calls `PermissionsAndroid.requestMultiple` for that permission's actual Android constants (fine/coarse location, POST_NOTIFICATIONS on Android 13+), instead of only updating local state. Device Administrator is flagged as needing a separate `DevicePolicyManager` activation flow, which isn't part of this scaffold.
- **Native Android modules implemented**: `AeroAlarmModule` (Lost Mode's Loud Alarm at max volume overriding silent mode, and Flashlight SOS pulsing the torch in Morse) and `AeroEmergencyModule` (direct emergency call + SMS to trusted contacts, with a Google Maps link to the last known location) — Kotlin source in `android/app/src/main/java/com/afmtechnologies/aero/modules/`, registered via `AeroPackage`, wrapped for JS in `src/native/aeroNativeModules.ts`. Wired into `useLostMode` and `useEmergency`; `LostModeScreen`'s alarm/flash buttons now show a "Stop" state while active.
- **Push notifications wired via `@react-native-firebase/messaging`**: `App.tsx` requests permission and shows a foreground alert for incoming pushes; `index.js` registers the required background message handler so Android can wake the app when backgrounded/closed.
- **Real launcher icons generated** for all mipmap densities (`mdpi` through `xxxhdpi`): legacy square icon, round icon, and adaptive-icon foreground layer, replacing the earlier XML-only placeholder. Simple "A" monogram on the brand primary color — swap for real artwork before shipping (see `docs/installation.md#app-icon`).
- `android/gradlew` and `android/gradlew.bat` wrapper launcher scripts added. `gradle-wrapper.jar` itself (a compiled binary, not source) still needs generating locally — see the README left in `android/gradle/wrapper/`.
- **Cloud Backup restore now fully implemented**: downloads the encrypted blob from Storage, decrypts it client-side with the device's Keystore-held key, and writes the restored devices back to Firestore (refreshing the `useDevices` cache). `CloudBackupScreen` now confirms before restoring and shows a per-item loading spinner.
- **`android/` native project scaffold**: Kotlin `MainActivity`/`MainApplication`, `AndroidManifest.xml` (declaring every permission the app's modules use — location, notifications, camera for Flashlight SOS, call/SMS for Emergency SOS, device admin, foreground service for Lost Mode), Gradle files targeting RN 0.75.4 / compileSdk 34 with the Google services plugin and release signing config wired to `AERO_UPLOAD_*` Gradle properties, base `res/` (strings, colors mirroring `src/constants/colors.ts`). `npm install` + Android Studio is enough to open and build; no `react-native init` needed.
- **Client-side backup encryption**: `src/utils/backupEncryption.ts` generates a per-device AES key stored in the Android Keystore (via `react-native-keychain`) and encrypts backup payloads before upload; `useCloudBackup` now actually encrypts + calls `cloudBackupService.uploadEncryptedBackup` instead of just recording metadata.
- **Emergency SOS now uses a real "current device"** instead of a hardcoded placeholder id: `useEmergency` reads `state.device.currentDeviceId` (falling back to the first registered device), and `DeviceDetailsScreen` marks a device as current when opened.
- CI signing env vars renamed to match `gradle.properties` (`AERO_UPLOAD_STORE_PASSWORD`, `AERO_UPLOAD_KEY_ALIAS`, `AERO_UPLOAD_KEY_PASSWORD`).
- **Every mock hook now wired to its Firestore service** via React Query (`useDevices`, `useSecurityCenter`, `useDeviceLocation`, `useLostMode`, `useNotifications`, `useTrustedContacts`, `useEmergency`, `useCloudBackup`). Each hook automatically uses real Firestore data when a user is signed in, and falls back to the existing mock data when signed out — so the app keeps working with no Firebase project configured, and switches over to real data as soon as `google-services.json` + auth are set up. No screens changed since hook return shapes were kept identical.
- `firestore.rules` — baseline security rules restricting every `users/{uid}/**` document to its owner. Deploy with `firebase deploy --only firestore:rules`.
- `useAuthUser` hook exposing the current Firebase uid from the `auth` Redux slice.
- `useNotifications` now subscribes to Firestore in real time (`onSnapshot`) rather than one-time fetches, so push-triggered writes show up immediately.
- **Firestore service wrappers for every module**, following the same pattern as `deviceService.ts`: `securityService.ts`, `locationService.ts`, `lostModeService.ts`, `notificationService.ts`, `trustedContactsService.ts`, `emergencyService.ts` (also records SOS trigger events), `cloudBackupService.ts` (Firestore metadata + Storage upload for encrypted payloads). Full collection-path table added to `docs/developer-guide.md#firebase`.
- `@react-native-firebase/storage` added for encrypted backup uploads.
- **Firebase Authentication wired in for real**: `src/services/authService.ts` (email/password sign-up + sign-in, Google Sign-In, password reset, sign-out, error-message mapping) is now used directly by Login, Register, Forgot Password, and Settings (Sign Out) — no longer just mock navigation.
- `App.tsx` configures Google Sign-In and subscribes to Firebase's `onAuthStateChanged`, syncing the session into the `auth` Redux slice.
- Splash screen now checks the real Firebase auth state to decide between Onboarding and the app.
- `src/firebase/firebaseClient.ts` — central Firebase module exports + Firestore persistence settings.
- `src/services/deviceService.ts` — Firestore-backed device CRUD (`users/{uid}/devices/{id}`), ready to swap into `useDevices` once you want to move off mock data.
- `src/constants/env.ts` for the Firebase Web Client ID.
- Loading states and inline error messages added to Login, Register, and Forgot Password forms.
- Firebase native setup (Gradle plugin, `google-services.json`) documented in `docs/installation.md`; service architecture documented in `docs/developer-guide.md#firebase`.
- **All remaining app modules scaffolded with working UI (mock-backed):**
  - Trusted Contacts — add/remove contacts, emergency-contact & location-sharing toggles.
  - Emergency — SOS button with confirmation, emergency contact list, medical information form.
  - Notifications — unified notification feed with unread badge, accessible from a bell icon on the Dashboard.
  - Activity Timeline — merged feed of security events and device notifications, most recent first.
  - Analytics — weekly battery bar chart, storage report, RAM report (reusing `ProgressBar`).
  - Cloud Backup — encrypted sync messaging, manual "Back Up Now" with loading state, backup history with restore action.
  - Settings — full home screen with Appearance (Light/Dark/AMOLED), Notification Settings (per-category toggles), Sign Out, and links to every module above, plus Premium, Feedback, and About.
  - Premium — feature list and upgrade CTA (billing not yet wired).
  - Feedback — free-text submission form.
  - About — app/developer info and a consent/legal reminder.
- New nested `SettingsStackNavigator` wiring Settings + all of the above; `MainTabNavigator` now uses nested stacks for all four tabs (Dashboard, Devices, Security, Settings).
- Domain models + hooks for each new module: `TrustedContacts`, `Emergency`, `Notification`, `Analytics`, `CloudBackup` (`src/models/`, `src/hooks/`) — all mock-backed and ready to swap for real Firebase/Supabase data.
- **Security Center module**: overview with computed Security Score, Permission Center (revoke/grant any permission, mirrors the Owner Verification list), Active Sessions/Trusted Devices (sign out remote sessions, current session protected), Login & Activity History (login, password change, permission change, device registration, security alert events) — `src/screens/Security/`, nested `SecurityStackNavigator`.
- `PermissionGrant`/`SessionInfo`/`SecurityEvent` domain models and `useSecurityCenter` hook with a simple score formula (`src/models/Security.ts`, `src/hooks/useSecurityCenter.ts`), mock-backed and ready to swap for real Auth/Firestore data.
- **Lost Mode module**: activate/deactivate with confirmation dialogs, lock-screen owner message + contact phone/email + optional reward message, Loud Alarm and Flashlight SOS toggles/triggers, QR Recovery Card (`react-native-qrcode-svg`) encoding the owner's message and contact info — `src/screens/LostMode/`. Continuous location updates are explicitly scoped to only run while Lost Mode is active, per the spec.
- `LostModeConfig` domain model and `useLostMode` hook (`src/models/LostMode.ts`, `src/hooks/useLostMode.ts`), mock-backed and ready to swap for a real backend + native alarm/torch bridge.
- "Lost Mode" entry point added to Device Details.
- **Location module**: Map view (last known + safe-zone overlays via `react-native-maps`), Live Location toggle (updates only while explicitly enabled), Safe Zones/Geofencing (add zone, per-zone entry/exit alert toggles), Location Timeline/Movement History — `src/screens/Location/`.
- `Location`/`SafeZone` domain models and `useDeviceLocation` hook (`src/models/Location.ts`, `src/hooks/useDeviceLocation.ts`), mock-backed and ready to swap for a real location API.
- "Locate Device" entry point added to Device Details.
- Google Maps API key setup documented in `docs/installation.md`.
- **Device Management module**: Devices list (status, battery, storage, group badges), Device Details (rename, info grid, notes, remove device), Device Health (battery/storage/RAM/security progress report) — `src/screens/Devices/`.
- `Device` domain model with health/status helper functions (`src/models/Device.ts`) and `useDevices` hook as the single source of truth for device data (mock-backed, ready to swap for a real API).
- Reusable `DeviceCard` and `ProgressBar` components.
- Nested `DevicesStackNavigator` (list → details → health) wired into the Devices bottom tab.
- Project scaffold: Clean Architecture folder structure, TypeScript strict config, ESLint/Prettier.
- Design system: color tokens, typography, spacing, and shadow constants matching the Aero brand.
- Core flow: Splash → Onboarding → Login/Register/Forgot Password → Owner Verification → Dashboard (bottom tabs: Dashboard, Devices, Security, Settings).
- Owner Verification consent screen with per-permission explanations and toggles.
- Redux Toolkit store with `auth` and `device` slices; React Query client wiring.
- GitHub Actions workflow for lint/typecheck, debug APK build, and release AAB build.
- Initial documentation set (installation, folder structure, developer guide, contributing).

### Still pending
- `gradle-wrapper.jar` binary (run `gradle wrapper --gradle-version 8.8` locally, or open in Android Studio to auto-generate — `gradlew`/`gradlew.bat` scripts and `gradle-wrapper.properties` are already in place).
- Production-quality launcher icon artwork (current icons are a simple generated placeholder — see `docs/installation.md#app-icon`).
- Background location foreground service for Lost Mode's continuous location updates (a larger addition than the alarm/emergency native modules — needs a proper Android `Service` + notification channel).
- Payment/billing integration for Premium.

## [1.0.0] — Planned

First full release covering all 22 app modules per the Aero specification.

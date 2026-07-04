# Installation Guide

## Prerequisites

- Node.js 18+
- npm 9+
- JDK 17
- Android Studio (SDK + emulator, or a physical device with USB debugging)
- A Firebase project (for Auth, Firestore, Messaging)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

   The `android/` native project is included in this scaffold (Kotlin `MainActivity`/`MainApplication`, manifest with all permissions used by the app's modules, Gradle files targeting RN 0.75.4 / SDK 34, generated launcher icons). You do **not** need to run `react-native init` — just `npm install` and go. `gradlew`/`gradlew.bat` are included, but the `gradle-wrapper.jar` binary they call isn't (it's a compiled artifact, not source) — run `gradle wrapper --gradle-version 8.8` from `android/` once, or simply open the project in Android Studio, which regenerates it automatically on first sync.

2. **Configure Firebase**

   - Create a project at [console.firebase.google.com](https://console.firebase.google.com).
   - Add an Android app with package name `com.afmtechnologies.aero` (or update it in `android/app/build.gradle`).
   - Download `google-services.json` and place it at `android/app/google-services.json`.
   - Enable Email/Password and Google sign-in methods in Firebase Authentication.
   - Apply the Google services Gradle plugin:
     - In `android/build.gradle`, add `classpath("com.google.gms:google-services:4.4.2")` to `dependencies`.
     - In `android/app/build.gradle`, add `apply plugin: "com.google.gms.google-services"` at the bottom.
     - (Both are already present in this scaffold's Gradle files — this step is only needed if you regenerate them.)

3. **Configure Google Sign-In**

   - In the Firebase console, copy the **Web client ID** from the Google sign-in provider.
   - Paste it into `GOOGLE_WEB_CLIENT_ID` in `src/constants/env.ts`.

4. **Configure Google Maps (Location module)**

   - Get a Maps SDK for Android API key from the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis).
   - Add it to `android/app/src/main/AndroidManifest.xml`:
     ```xml
     <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_API_KEY" />
     ```
   - Never commit the real key — use a gradle property or `local.properties` (gitignored) and reference it via manifest placeholders.

5. **Run on Android**

   ```bash
   npm run android
   ```

6. **Lint &amp; type-check**

   ```bash
   npm run lint
   npm run typecheck
   ```

## App icon

Real launcher icon PNGs are included for every density (a simple "A" monogram on the brand primary color, generated as a placeholder) — the app will build and run with a proper icon out of the box. Replace them with real artwork before release: generate via Android Studio's Image Asset tool or https://icon.kitchen and overwrite the files in `android/app/src/main/res/mipmap-*/`.

## Building a release bundle

```bash
cd android
./gradlew bundleRelease
```

Signing credentials should be supplied via environment variables / Gradle properties — never commit a keystore or its password. See [developer-guide.md](developer-guide.md#signing) for details.

# Aero

**Secure. Protect. Recover.**

Aero is a personal device protection and management platform for Android, built with React Native and TypeScript. It helps you manage your own devices after explicit installation, permission grants, and owner verification.

> Aero is designed for managing devices you own or are explicitly authorized to manage. Owner verification and per-permission consent are required before any management feature activates.

---

## Status

All 22 modules from the Aero specification have working screens wired into navigation, backed by Firestore via React Query (with an automatic mock-data fallback when signed out — see [docs/CHANGELOG.md](docs/CHANGELOG.md)). The `android/` native project is included — `npm install` and open in Android Studio, no `react-native init` needed. Remaining work before a production release: real launcher icon assets, native bridges for Lost Mode alarm/SOS and background location, push notification delivery, and Premium billing.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React Native (latest stable) |
| Language | TypeScript (strict mode) |
| Navigation | React Navigation (native-stack + bottom-tabs) |
| State | Redux Toolkit + React Query |
| Storage | AsyncStorage + react-native-keychain (secure) |
| Backend | Firebase (Auth, Firestore, Messaging) — Supabase-compatible architecture |
| Auth | Email/Password + Google Sign-In |

## Getting Started

See [docs/installation.md](docs/installation.md) for full setup instructions.

```bash
npm install
npm run android
```

## Project Structure

See [docs/folder-structure.md](docs/folder-structure.md) for the full layout and [docs/developer-guide.md](docs/developer-guide.md) for architecture conventions.

## Documentation

- [Installation Guide](docs/installation.md)
- [Folder Structure Guide](docs/folder-structure.md)
- [Developer Guide](docs/developer-guide.md)
- [Contribution Guide](docs/contributing.md)
- [Changelog](docs/CHANGELOG.md)

## Future Roadmap

Wear OS · Tablet support · Desktop dashboard · Plugin system · AI insights · Cloud expansion · Premium features · Enterprise device management.

## License

MIT — see [LICENSE](LICENSE).

## Developer

**Md Arafat Hossen Mugdho** — AFM Technologies

# Folder Structure Guide

```
aero/
├── App.tsx                  # Root component — providers + navigator
├── index.js                 # Entry point (AppRegistry)
├── app.json                 # App name/display name
├── src/
│   ├── assets/               # Fonts, images, icons
│   ├── components/           # Reusable, presentational components
│   ├── hooks/                 # Reusable hooks (useDeviceStatus, usePermission, ...)
│   ├── screens/               # One folder per module (Splash, Onboarding, Auth, ...)
│   ├── navigation/            # Navigators + route param types
│   ├── services/              # Cross-cutting services (queryClient, notifications, ...)
│   ├── api/                   # API/network layer
│   ├── redux/
│   │   └── slices/            # Redux Toolkit slices
│   ├── context/               # React context providers (Theme, ...)
│   ├── utils/                 # Pure helper functions
│   ├── constants/              # Design tokens: colors, typography, spacing
│   ├── models/                 # Domain models
│   ├── types/                  # Shared TypeScript types
│   └── firebase/                # Firebase config & service wrappers
├── docs/                      # Documentation (this folder)
└── .github/workflows/          # CI/CD (Android build pipeline)
```

## Conventions

- **One module → one screens/ subfolder.** Each module (Device Management, Location, Lost Mode, ...) gets its own folder under `src/screens/`.
- **Design tokens only from `src/constants/`.** Never hardcode colors or font sizes in a screen/component.
- **Path aliases.** Use `@screens/...`, `@components/...`, etc. (configured in `tsconfig.json` and `babel.config.js`) instead of relative `../../../` imports.
- **State:** local UI state → `useState`; cross-screen app state → Redux slice in `src/redux/slices/`; server/cache state → React Query in `src/api/`.
- **Strict TypeScript.** No `any` without justification; all props and slice state are typed.

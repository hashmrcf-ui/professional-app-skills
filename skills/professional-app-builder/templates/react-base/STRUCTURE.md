# React Base Template

This is the recommended starting structure for a React (Vite + TypeScript) app built with this skill.

## Directory Layout

```
src/
├── main.tsx
├── App.tsx                          # Router + i18n + theme wiring
├── app/
│   ├── theme/
│   │   ├── colors.ts                # Color tokens
│   │   └── tailwind.config.cjs      # Extended Tailwind config
│   └── router/
│       └── index.tsx                # createBrowserRouter
├── features/
│   └── [feature_name]/
│       ├── screens/
│       │   └── [ScreenName].tsx
│       ├── components/
│       │   └── [ComponentName].tsx
│       └── hooks/
│           └── use[HookName].ts
├── shared/
│   ├── components/
│   │   ├── Button.tsx               # Press feedback built in
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── AnimatedCounter.tsx      # From examples/animated-counter-react
│   │   ├── Skeleton.tsx
│   │   └── Icon.tsx
│   ├── utils/
│   │   ├── direction.ts             # isRtl() helper
│   │   └── formatters.ts
│   └── constants/
│       └── index.ts
└── i18n/
    ├── index.ts
    └── locales/
        ├── en.json
        └── ar.json
```

## Required Dependencies (package.json)

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "react-i18next": "^15.0.0",
    "i18next": "^23.13.0",
    "i18next-browser-languagedetector": "^8.0.0",
    "lucide-react": "^0.439.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4",
    "vite": "^5.4.2"
  }
}
```

## main.tsx Starter

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## App.tsx Starter

```tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';

export function App() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    document.documentElement.classList.toggle('font-arabic', isRtl);
  }, [i18n.language, isRtl]);

  return <RouterProvider router={router} />;
}
```

## Build Order

When creating a new React app from this template, build in this order:

1. `app/theme/colors.ts` — define the palette
2. `tailwind.config.cjs` — wire colors, fonts, spacing per the resources
3. `i18n/index.ts` and `i18n/locales/` — set up translation
4. `App.tsx` — root component with direction switching
5. `shared/components/` — reusable components (one at a time)
6. `app/router/index.tsx` — define routes (max 3 levels deep)
7. `features/` — build features one screen at a time

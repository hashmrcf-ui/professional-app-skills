# i18n & RTL Guide

Multi-language and right-to-left support are first-class citizens in this skill, not afterthoughts.

---

## Decision Matrix

| App Languages | Setup |
|---|---|
| English only | Skip i18n setup. Use direct strings. |
| Arabic only | Set up RTL globally. Use `Cairo` font. Translation keys still recommended for future-proofing. |
| Both | Full i18n with `flutter_localizations` / `react-i18next`. Dynamic direction switching. |

---

## Flutter Setup

### 1. Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter_localizations:
    sdk: flutter
  intl: ^0.19.0

flutter:
  generate: true
```

### 2. l10n.yaml (project root)

```yaml
arb-dir: lib/l10n
template-arb-file: app_en.arb
output-localization-file: app_localizations.dart
```

### 3. Translation Files

**lib/l10n/app_en.arb**:
```json
{
  "@@locale": "en",
  "appTitle": "My App",
  "homeWelcome": "Welcome",
  "homeWelcomeUser": "Welcome, {name}",
  "@homeWelcomeUser": {
    "placeholders": { "name": { "type": "String" } }
  }
}
```

**lib/l10n/app_ar.arb**:
```json
{
  "@@locale": "ar",
  "appTitle": "تطبيقي",
  "homeWelcome": "أهلاً بك",
  "homeWelcomeUser": "أهلاً بك، {name}"
}
```

### 4. MaterialApp Configuration

```dart
import 'package:flutter_localizations/flutter_localizations.dart';
import 'l10n/app_localizations.dart';

MaterialApp(
  localizationsDelegates: AppLocalizations.localizationsDelegates,
  supportedLocales: AppLocalizations.supportedLocales,
  locale: const Locale('ar'), // or driven by user setting
  builder: (context, child) {
    final isRtl = Localizations.localeOf(context).languageCode == 'ar';
    return Directionality(
      textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
      child: child!,
    );
  },
  home: const HomeScreen(),
)
```

### 5. Usage in Widgets

```dart
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

Widget build(BuildContext context) {
  final l10n = AppLocalizations.of(context)!;
  return Text(l10n.homeWelcome);
}
```

---

## React Setup

### 1. Install

```bash
npm install react-i18next i18next i18next-browser-languagedetector
```

### 2. Config

**src/i18n/index.ts**:
```ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
```

### 3. Translation Files

**src/i18n/locales/en.json**:
```json
{
  "appTitle": "My App",
  "home": {
    "welcome": "Welcome",
    "welcomeUser": "Welcome, {{name}}"
  }
}
```

**src/i18n/locales/ar.json**:
```json
{
  "appTitle": "تطبيقي",
  "home": {
    "welcome": "أهلاً بك",
    "welcomeUser": "أهلاً بك، {{name}}"
  }
}
```

### 4. Direction Switching

**src/App.tsx**:
```tsx
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function App() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRtl]);

  return <YourApp />;
}
```

### 5. Usage

```tsx
import { useTranslation } from 'react-i18next';

function HomeScreen() {
  const { t } = useTranslation();
  return <h1>{t('home.welcome')}</h1>;
}
```

---

## RTL Layout Rules

When direction is RTL:

| Property | LTR Value | RTL Value | Notes |
|---|---|---|---|
| Text alignment | left | right | Use `start`/`end` instead of `left`/`right` |
| Icon position (back arrow) | left | right | Mirror automatically with `Directionality` (Flutter) or `dir` (CSS) |
| List item disclosure (>) | right | left (flipped) | Use Material's `Icons.chevron_right` — it auto-flips |
| Padding shortcuts | `padding-left` | `padding-right` | Use logical properties: `padding-inline-start` |
| Animations (slide) | left-to-right | right-to-left | Mirror direction |

---

## Common RTL Mistakes to Avoid

1. ❌ Hardcoding `Alignment.centerLeft` — use `AlignmentDirectional.centerStart`
2. ❌ Hardcoding `padding-left: 16px` — use `padding-inline-start: 16px`
3. ❌ Forgetting to mirror progress bars and sliders
4. ❌ Using `Icons.arrow_forward` instead of `Icons.arrow_forward_ios` (the latter auto-flips)
5. ❌ Numbers and Latin text inside Arabic context — wrap in `<bdo dir="ltr">` if needed

---

## Font Switching by Locale

**Flutter**:
```dart
TextStyle textStyle(BuildContext ctx) {
  final isAr = Localizations.localeOf(ctx).languageCode == 'ar';
  return isAr
    ? GoogleFonts.cairo(fontSize: 16)
    : GoogleFonts.inter(fontSize: 16);
}
```

**React (Tailwind)**:
```tsx
<body className={isRtl ? 'font-arabic' : 'font-sans'}>
```

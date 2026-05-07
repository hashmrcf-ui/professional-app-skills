---
name: professional-app-builder
description: Build production-grade mobile (Flutter) and web (React) apps with enforced UX standards. Use when the user wants to create a complete app with professional UI, proper navigation, animations, RTL support, and zero shortcuts. Triggers on requests like "build me an app", "create a Flutter project", "make a React app with Arabic support", or any full app scaffolding request.
version: 1.0.0
license: MIT
---

# Professional App Builder

A skill for building production-grade applications with enforced UX standards, multi-language support, and zero compromises on quality.

## When to Activate

Activate this skill when the user asks to:
- Build a complete mobile or web application
- Scaffold a new Flutter or React project with professional UI
- Create an app with Arabic / multi-language / RTL support
- Convert a design or idea into a working app

**Do NOT activate** for: small components, single-screen tasks, debugging existing apps, or web scraping.

---

## Workflow Overview

This skill follows a strict 5-step pipeline. **Do not skip steps. Do not reorder them.**

```
Step 1: Requirements Gathering  →  conversational, one question at a time
Step 2: Plan Confirmation       →  structured summary, wait for approval
Step 3: Foundation Setup        →  theme, structure, shared components
Step 4: Screen-by-Screen Build  →  one screen at a time, confirm each
Step 5: Validation & Handoff    →  run automated checks, deliver
```

---

## Step 1 — Requirements Gathering

Ask these questions **one at a time**, waiting for each answer before proceeding to the next:

1. **App concept**: "ما اسم التطبيق وما هدفه الرئيسي؟ / What is the app name and its main purpose?"
2. **Target platform**: "Flutter (موبايل) أم React (ويب) أم الاثنين؟ / Flutter, React, or both?"
3. **Primary language**: "اللغة الرئيسية؟ (عربي / إنجليزي / متعدد) / Primary language? (Arabic / English / Multi)"
4. **Color palette**: "الألوان الرئيسية؟ (hex codes أو وصف الأسلوب) / Primary colors? (hex codes or style description)"
5. **Images source**: "صور جاهزة أم Unsplash API؟ / Pre-made images or Unsplash API?"
6. **Key screens**: "ما الشاشات الأساسية؟ / What are the core screens?"
7. **Special features**: "ميزات خاصة؟ (auth, maps, notifications, payments...)"
8. **Additional preferences**: "أي تفضيلات إضافية؟ / Any other preferences?"

**Important**: If the user provides everything in the first message, skip the back-and-forth and move directly to Step 2 with their input.

---

## Step 2 — Plan Confirmation

Before writing **any** code, present this structured summary:

```
═══════════════════════════════════════
  APP BUILD PLAN
═══════════════════════════════════════
  Name:          [app name]
  Platform:      [Flutter / React / Both]
  Languages:     [ar / en / both]
  Direction:     [LTR / RTL / both]
  Primary Color: [#hex]
  Accent Color:  [#hex]
  Screens:       [list]
  Libraries:     [list]
  Image Source:  [user-provided / Unsplash]
  Features:      [list]
═══════════════════════════════════════
```

Then ask: **"هل الخطة صحيحة؟ نبدأ التنفيذ؟ / Plan correct? Shall we proceed?"**

Wait for explicit approval (e.g. "نعم", "yes", "ابدأ", "go").

---

## Step 3 — Foundation Setup

Build in this exact order:

1. **Project scaffolding** — use `templates/` folder as the starting point
2. **Theme system** — colors, typography, spacing (load `resources/typography-scale.md` and `resources/spacing-system.md`)
3. **i18n setup** — if multi-language, configure from day one (load `resources/i18n-guide.md`)
4. **Shared components** — Button, Card, Input, Icon wrapper, AnimatedCounter
5. **Navigation shell** — bottom tabs / app router

**Reference files to load BEFORE building**:
- `resources/ui-rules.md` — non-negotiable UX rules
- `resources/animation-patterns.md` — required animations
- `resources/typography-scale.md` — font system
- `resources/spacing-system.md` — 8px grid

---

## Step 4 — Screen-by-Screen Build

For **each** screen, follow this micro-loop:

```
1. Build the screen completely
2. Wire its navigation
3. Add animations
4. Show the user
5. Ask: "هل هذه الشاشة مناسبة؟ تعديل قبل المتابعة؟"
6. Apply edits or move to next screen
```

**Never** build multiple screens at once without showing the user.

---

## Step 5 — Validation & Handoff

Before declaring the app complete, **run all validation scripts**:

```bash
# Run automated validators
node scripts/validate-no-emoji.js [project-path]
node scripts/validate-3-clicks.js [project-path]
node scripts/validate-rtl-support.js [project-path]
node scripts/validate-animations.js [project-path]

# Run platform-specific checks
# Flutter:
flutter analyze
flutter test

# React:
npm run lint
npm test
```

Then verify the manual checklist (see `resources/final-checklist.md`).

**If any check fails: fix it before delivery. No exceptions.**

---

## Non-Negotiable Rules

These rules apply to **every** app built with this skill. They are enforced by the validation scripts.

### Icons & Graphics
- ❌ NEVER use emoji as UI icons
- ✅ Flutter: `Material Icons` + `flutter_svg`
- ✅ React: `lucide-react` or `heroicons`
- ✅ For custom icons: inline SVG components

### Navigation — The 3-Tap Rule
- Any feature must be reachable in **≤ 3 taps** from home
- Maximum nesting: `Home → Category → Detail`
- Use bottom tabs for main sections (max 5)

### Animations — Required Behaviors
- Counters must animate (counting-up effect)
- Screen transitions: 300ms fade or slide
- Button press: 0.95 scale feedback
- Loading: skeleton screens, never plain spinners
- List items: staggered entrance

### Internationalization
- Multi-language apps: i18n configured from the start
- Arabic apps: RTL layout enforced
- No hardcoded strings — always translation keys
- Arabic font: `Cairo` or `Tajawal`
- English font: `Inter` or `Poppins`

### Spacing & Layout
- 8px grid system: 8, 16, 24, 32, 48, 64
- Card radius: 12-16px
- Button height: 48-56px (touch target)
- Always handle safe area insets

---

## Examples

See `examples/` folder for complete reference apps:
- `examples/flutter-todo-app/` — Flutter app with Arabic + RTL
- `examples/react-dashboard/` — React app with i18n + animations
- `examples/animated-counter-flutter/` — Standalone counter component
- `examples/animated-counter-react/` — Standalone counter component

---

## Templates

See `templates/` folder for project starters:
- `templates/flutter-base/` — Flutter project structure
- `templates/react-base/` — React project structure

---

## Author

Created and maintained by the open-source community under MIT license.

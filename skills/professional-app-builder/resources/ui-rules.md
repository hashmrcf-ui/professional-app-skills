# UI Rules — Non-Negotiable

These rules apply to every app built with this skill. They are enforced by validators in `scripts/`.

---

## Rule 1 — No Emoji as UI Icons

**Why**: Emojis render inconsistently across platforms, look unprofessional, and break in dark mode.

**Forbidden**:
```jsx
<Text>🏠 Home</Text>
<Text>⚙️ Settings</Text>
```

**Required**:
```jsx
// React
import { Home, Settings } from 'lucide-react';
<Home size={24} />
<Settings size={24} />

// Flutter
Icon(Icons.home, size: 24)
Icon(Icons.settings, size: 24)
```

**Allowed exception**: Emojis inside user-generated content (chat messages, post bodies). Never in UI chrome.

---

## Rule 2 — The 3-Tap Rule

**Why**: Every additional tap loses 30% of users.

Any primary feature must be reachable within **3 taps** from the home screen.

**Maximum allowed structure**:
```
Home (tab 1) → Category list → Detail screen
   tap 0          tap 1            tap 2
```

**Forbidden**:
```
Home → Section → Sub-section → Category → Item → Detail
                                                     ↑ tap 5 — REJECTED
```

**Implementation**:
- Use bottom tab navigation for top-level sections (max 5 tabs)
- Use cards/grids on the home screen for shortcuts to deep features
- Avoid hamburger menus that hide important features

---

## Rule 3 — Touch Targets

Minimum tappable area: **48×48 dp (Android) / 44×44 pt (iOS)**.

- Buttons: height 48-56px
- Icon buttons: padding ensures 48px hit area even if icon is 24px
- List items: minimum 56px height

---

## Rule 4 — Spacing System

Use the **8px grid** exclusively. Allowed spacing values:

```
4   — micro spacing (icon-to-text)
8   — tight (between related items)
16  — default (between sections)
24  — comfortable (around cards)
32  — generous (between major blocks)
48  — section breaks
64  — hero / landing spacing
```

**Forbidden**: 5, 7, 10, 13, 15, 20, 25, etc. Always snap to the grid.

---

## Rule 5 — Loading States

**Forbidden**: Lone spinner with no context.

**Required**: Skeleton screens that mirror the final layout.

```jsx
// React
{loading ? <CardSkeleton /> : <Card data={data} />}

// Flutter
loading ? const CardSkeleton() : Card(data: data)
```

---

## Rule 6 — Press Feedback

Every interactive element must give visual feedback on press.

**React Native / Web**:
```jsx
<Pressable
  style={({ pressed }) => [
    styles.button,
    { transform: [{ scale: pressed ? 0.95 : 1 }] }
  ]}
>
```

**Flutter**:
```dart
GestureDetector(
  onTapDown: (_) => setState(() => _scale = 0.95),
  onTapUp: (_) => setState(() => _scale = 1.0),
  child: AnimatedScale(
    scale: _scale,
    duration: const Duration(milliseconds: 100),
    child: ...
  ),
)
```

---

## Rule 7 — Safe Area Handling

Always respect device safe areas (notch, home indicator, status bar).

**React Native**:
```jsx
import { SafeAreaView } from 'react-native-safe-area-context';
<SafeAreaView edges={['top', 'bottom']}>
```

**Flutter**:
```dart
SafeArea(child: ...)
```

---

## Rule 8 — Card Radius

- Standard cards: 12px
- Featured / hero cards: 16px
- Buttons: 8-12px
- Inputs: 8-12px

**Forbidden**: 0px (sharp corners) on cards, or radius > 24px on standard UI.

---

## Rule 9 — Color Usage

- Primary color: ≤ 20% of any screen
- Accent color: ≤ 10% of any screen
- Neutrals (grays/whites): the rest
- One semantic color per state: success (green), warning (amber), error (red), info (blue)

---

## Rule 10 — No Hardcoded Strings (i18n apps)

If the app supports more than one language, **every** user-facing string must be a translation key.

**Forbidden**:
```jsx
<Text>Welcome</Text>
```

**Required**:
```jsx
<Text>{t('home.welcome')}</Text>
```

# Typography Scale

A consistent type scale is the foundation of a professional UI.

---

## Font Selection

### Arabic
- **Primary**: `Cairo` (modern, geometric, excellent legibility)
- **Alternative**: `Tajawal` (slightly more humanist)
- **Source**: Google Fonts

### English
- **Primary**: `Inter` (designed for screens, excellent at small sizes)
- **Alternative**: `Poppins` (friendlier, more rounded)
- **Source**: Google Fonts

### Multi-language Apps
Load both fonts and switch automatically based on the rendered text's script.

---

## Type Scale

| Token | Size | Line Height | Weight | Usage |
|---|---|---|---|---|
| `display` | 32px | 40px | 700 | Hero titles, splash screens |
| `h1` | 24px | 32px | 700 | Screen titles |
| `h2` | 20px | 28px | 600 | Section headers |
| `h3` | 18px | 24px | 600 | Card titles |
| `body` | 16px | 24px | 400 | Default body text |
| `body-sm` | 14px | 20px | 400 | Secondary text |
| `caption` | 12px | 16px | 500 | Labels, metadata |
| `tiny` | 10px | 14px | 500 | Badges, counts |

---

## Flutter Implementation

```dart
// lib/app/theme/text_styles.dart

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppText {
  static TextStyle display(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 32, height: 40 / 32, fontWeight: FontWeight.w700,
  );
  static TextStyle h1(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 24, height: 32 / 24, fontWeight: FontWeight.w700,
  );
  static TextStyle h2(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 20, height: 28 / 20, fontWeight: FontWeight.w600,
  );
  static TextStyle h3(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 18, height: 24 / 18, fontWeight: FontWeight.w600,
  );
  static TextStyle body(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 16, height: 24 / 16, fontWeight: FontWeight.w400,
  );
  static TextStyle bodySm(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 14, height: 20 / 14, fontWeight: FontWeight.w400,
  );
  static TextStyle caption(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 12, height: 16 / 12, fontWeight: FontWeight.w500,
  );
  static TextStyle tiny(BuildContext ctx) => GoogleFonts.cairo(
    fontSize: 10, height: 14 / 10, fontWeight: FontWeight.w500,
  );
}
```

---

## React Implementation (Tailwind)

```js
// tailwind.config.js
module.exports = {
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      arabic: ['Cairo', 'sans-serif'],
    },
    fontSize: {
      'display': ['2rem',    { lineHeight: '2.5rem',  fontWeight: '700' }],
      'h1':      ['1.5rem',  { lineHeight: '2rem',    fontWeight: '700' }],
      'h2':      ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
      'h3':      ['1.125rem',{ lineHeight: '1.5rem',  fontWeight: '600' }],
      'body':    ['1rem',    { lineHeight: '1.5rem',  fontWeight: '400' }],
      'body-sm': ['0.875rem',{ lineHeight: '1.25rem', fontWeight: '400' }],
      'caption': ['0.75rem', { lineHeight: '1rem',    fontWeight: '500' }],
      'tiny':    ['0.625rem',{ lineHeight: '0.875rem',fontWeight: '500' }],
    },
  },
}
```

---

## Rules

- ❌ Never use sizes outside this scale
- ❌ Never use font weights outside: 400, 500, 600, 700
- ❌ Never set line-height as a unitless value below 1.2 or above 1.6
- ✅ Always use semantic tokens (`h1`, `body`) not raw sizes (`24px`, `16px`)
- ✅ Letter-spacing: 0 for body, -0.5 for headings 24px+

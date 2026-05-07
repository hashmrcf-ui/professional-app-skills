# Spacing System

The 8px grid is non-negotiable. All spacing must use these values.

---

## The Scale

```
xs   = 4px    (micro: icon-to-text, badge padding)
sm   = 8px    (tight: between related items)
md   = 16px   (default: between sections)
lg   = 24px   (comfortable: around cards)
xl   = 32px   (generous: between major blocks)
2xl  = 48px   (section breaks)
3xl  = 64px   (hero spacing)
```

---

## Flutter Implementation

```dart
// lib/app/theme/spacing.dart

class AppSpacing {
  static const double xs   = 4.0;
  static const double sm   = 8.0;
  static const double md   = 16.0;
  static const double lg   = 24.0;
  static const double xl   = 32.0;
  static const double xxl  = 48.0;
  static const double xxxl = 64.0;

  // Common edge insets
  static const EdgeInsets paddingMd  = EdgeInsets.all(md);
  static const EdgeInsets paddingLg  = EdgeInsets.all(lg);
  static const EdgeInsets screenPadding = EdgeInsets.symmetric(horizontal: md, vertical: lg);

  // Common gaps (for Column/Row spacing)
  static const SizedBox gapXs  = SizedBox(width: xs,  height: xs);
  static const SizedBox gapSm  = SizedBox(width: sm,  height: sm);
  static const SizedBox gapMd  = SizedBox(width: md,  height: md);
  static const SizedBox gapLg  = SizedBox(width: lg,  height: lg);
  static const SizedBox gapXl  = SizedBox(width: xl,  height: xl);
}
```

---

## React Implementation (Tailwind)

Tailwind's default scale already aligns with the 8px grid. Use these classes only:

```
p-1  / m-1  / gap-1   = 4px   (xs)
p-2  / m-2  / gap-2   = 8px   (sm)
p-4  / m-4  / gap-4   = 16px  (md)
p-6  / m-6  / gap-6   = 24px  (lg)
p-8  / m-8  / gap-8   = 32px  (xl)
p-12 / m-12 / gap-12  = 48px  (2xl)
p-16 / m-16 / gap-16  = 64px  (3xl)
```

**Forbidden Tailwind classes**: `p-3` (12px), `p-5` (20px), `p-7` (28px), `p-9` (36px), `p-10` (40px), `p-11` (44px), etc.

---

## Layout Rules

### Card Internal Padding
- Standard cards: `lg` (24px)
- Compact cards (in dense lists): `md` (16px)
- Hero cards: `xl` (32px)

### Screen Padding
- Horizontal: `md` (16px) on phone, `lg` (24px) on tablet
- Top: `lg` (24px) below header
- Bottom: `xl` (32px) above bottom navigation

### Stack Gaps
- Between form fields: `md` (16px)
- Between sections: `lg` (24px) or `xl` (32px)
- Between paragraphs: `md` (16px)

### Inline Gaps
- Between icon and label: `sm` (8px)
- Between buttons in a row: `sm` (8px) or `md` (16px)
- Between chips: `xs` (4px) or `sm` (8px)

---

## Border Radius (related to spacing)

```
none    = 0px    (full-width banners only)
sm      = 4px    (badges, chips)
md      = 8px    (buttons, inputs)
lg      = 12px   (cards — default)
xl      = 16px   (featured cards)
2xl     = 24px   (modal sheets)
full    = 9999px (avatars, pills)
```

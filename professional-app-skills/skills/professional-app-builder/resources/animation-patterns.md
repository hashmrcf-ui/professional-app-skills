# Animation Patterns

All apps built with this skill must include these animations. They are not optional.

---

## 1. Counter Animation (Mandatory for all numbers)

Every numeric display (stats, prices, counts, ratings) must animate from 0 to its final value when first rendered.

**Why**: Static numbers feel dead. Animated numbers feel alive and draw the eye.

See `examples/animated-counter-flutter/` and `examples/animated-counter-react/` for full implementations.

**Duration**: 1000ms by default, 600ms for small numbers (<100), 1500ms for large numbers (>10000).

**Curve**: `Curves.easeOut` (Flutter) / `easeOutCubic` (React).

---

## 2. Screen Transitions

| Transition Type | Duration | Curve | When to Use |
|---|---|---|---|
| Fade | 300ms | easeOut | Modal overlays, dialogs |
| Slide horizontal | 300ms | easeOut | Forward/back navigation |
| Slide vertical | 350ms | easeOut | Bottom sheets, full-screen modals |
| Scale + fade | 250ms | easeOut | Sharing, expanding cards |

**Never use**: bounce, elastic, or curves longer than 400ms for navigation.

---

## 3. Button Press Feedback

```
Default state    → scale 1.0
Press down       → scale 0.95 (100ms)
Release          → scale 1.0  (150ms)
```

Combined with optional opacity change: `1.0 → 0.85 → 1.0`.

---

## 4. List Item Stagger

When a list first appears, items should fade in with a stagger:

```
Item 1: delay 0ms,    fade in over 300ms
Item 2: delay 50ms,   fade in over 300ms
Item 3: delay 100ms,  fade in over 300ms
...
```

**Cap the stagger**: after the 8th item, delay = 0 (otherwise long lists feel slow).

---

## 5. Skeleton Loading

While data loads, show shimmer-animated placeholders that match the final layout.

**Shimmer cycle**: 1500ms loop, gradient sweeps left-to-right (or right-to-left for RTL).

```jsx
// React (using react-loading-skeleton or custom)
<Skeleton height={120} width="100%" borderRadius={12} />

// Flutter (using shimmer package)
Shimmer.fromColors(
  baseColor: Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: Container(height: 120, decoration: ...),
)
```

---

## 6. Page Header Collapse

On scrollable screens with a hero header, the header should collapse smoothly:

```
ScrollOffset 0   → header height: 240px, full title
ScrollOffset 200 → header height: 80px,  small title only
```

Interpolate everything: height, font size, opacity of subtitle.

---

## 7. Tab Bar Indicator

When switching bottom tabs, the indicator (icon scale + color shift) should animate:

```
Inactive → Active: 200ms easeOut
  - Icon scale: 1.0 → 1.15
  - Color: gray → primary
  - Optional: small dot appears below
```

---

## 8. Pull-to-Refresh

Use platform defaults — but ensure the loading icon respects RTL direction.

---

## Animation Don'ts

- ❌ No animation longer than 600ms for UI feedback
- ❌ No bouncing on screen transitions
- ❌ No simultaneous animations on more than 3 elements
- ❌ No animations on scroll (causes jank)
- ❌ No infinite loops except for loading skeletons

# Final Checklist

Run this checklist before declaring any app complete. The agent must verify every item.

---

## Automated Checks (Run First)

```bash
# From the project root
node <skill-path>/scripts/validate-no-emoji.js .
node <skill-path>/scripts/validate-3-clicks.js .
node <skill-path>/scripts/validate-rtl-support.js .
node <skill-path>/scripts/validate-animations.js .
```

Then run the platform-native tooling:

**Flutter**:
```bash
flutter analyze
flutter test
flutter build apk --debug   # ensures it builds
```

**React**:
```bash
npm run lint
npm test
npm run build               # ensures it builds
```

All of the above must pass with **zero errors** before continuing.

---

## Manual Verification

### Icons & Graphics
- [ ] No emoji used as UI icons (validator passed)
- [ ] All icons come from a proper SVG icon library
- [ ] Custom icons use inline SVG components, not raster images
- [ ] Icon sizes are consistent (typically 20px or 24px)

### Navigation
- [ ] Every primary feature reachable in ≤ 3 taps from home
- [ ] Bottom tab bar present (if app has 2+ main sections)
- [ ] Maximum 5 tabs in bottom navigation
- [ ] Back button behavior works correctly on every screen

### Animations
- [ ] All numeric displays use `AnimatedCounter`
- [ ] Screen transitions are smooth (300ms, no bounce)
- [ ] Buttons scale on press (0.95 transform)
- [ ] Loading states use skeleton screens, not lone spinners
- [ ] Lists have staggered entrance animation

### Internationalization
- [ ] If multi-language: i18n is configured and working
- [ ] If Arabic: RTL layout works on every screen
- [ ] No hardcoded user-facing strings (all use translation keys)
- [ ] Fonts switch correctly between Arabic (`Cairo`) and English (`Inter`)
- [ ] Numbers and dates respect locale formatting

### Typography & Spacing
- [ ] All text uses the defined type scale (display/h1/h2/h3/body/...)
- [ ] All spacing uses 8px grid values (4, 8, 16, 24, 32, 48, 64)
- [ ] Card radius is 12-16px
- [ ] Button height is 48-56px

### Images
- [ ] User-provided images are referenced correctly
- [ ] Unsplash images use proper URL format
- [ ] All image lists use lazy loading
- [ ] Blur placeholder shown while loading

### Safe Areas
- [ ] Status bar / notch handled on iOS
- [ ] Home indicator handled on iOS
- [ ] System nav bar handled on Android
- [ ] No content cut off or overlapping system UI

### Build & Run
- [ ] App builds without warnings
- [ ] App runs on target platform without crashes
- [ ] No console errors during navigation
- [ ] Hot reload / hot restart works

### Code Quality
- [ ] No commented-out code blocks
- [ ] No `console.log` / `print` statements left in production paths
- [ ] No `TODO` comments without an assigned task
- [ ] File structure follows the templates

---

## If Any Check Fails

**Do not deliver a partially-passing app.** Either:
1. Fix the issue immediately, or
2. Tell the user explicitly what failed and ask for permission to ship anyway

Never silently skip a failing check.

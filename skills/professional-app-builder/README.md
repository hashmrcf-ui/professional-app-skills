# Professional App Builder

> A skill for building production-grade Flutter and React apps with enforced UX standards, multi-language support, and zero compromises on quality.

## What This Skill Does

When activated, this skill guides an AI agent through a strict 5-step pipeline to build a complete app:

1. **Gathers requirements** through a guided conversation
2. **Confirms the plan** before any code is written
3. **Sets up foundation** (theme, i18n, shared components)
4. **Builds screens** one at a time with user approval
5. **Validates everything** with automated scripts before delivery

## Why This Skill Exists

Most AI-generated apps fail in production for the same reasons:
- Emoji used as UI icons
- Deep nested navigation (5+ taps to reach features)
- Static numbers with no animation
- Hardcoded strings, no i18n
- Broken RTL layouts for Arabic
- Random spacing, no design system

This skill enforces solutions to all of these — automatically.

## Installation

### With Claude Code / Cursor / Gemini CLI

```bash
npx skills add <your-org>/professional-app-skills --skill professional-app-builder --global
```

### Manual

Clone this repo and place the `professional-app-builder/` folder in your agent's skills directory.

## Usage

After installation, just ask your agent:

```
Build me a Flutter app for a restaurant menu, in Arabic, with brown and gold colors.
```

The skill takes over and guides the build.

## What Gets Enforced

| Rule | How |
|---|---|
| No emoji icons | `validate-no-emoji.js` scans the codebase |
| 3-tap navigation max | `validate-3-clicks.js` analyzes the router |
| RTL support for Arabic | `validate-rtl-support.js` checks i18n config |
| Animated counters | `validate-animations.js` looks for `AnimatedCounter` usage |
| 8px grid spacing | Documented in `resources/spacing-system.md` |
| Proper typography | Documented in `resources/typography-scale.md` |

## Folder Structure

```
professional-app-builder/
├── SKILL.md                # Mission control for the agent
├── README.md               # This file
├── scripts/                # Automated validators
├── resources/              # Knowledge base (rules, guides)
├── examples/               # Gold-standard reference apps
└── templates/              # Project starters (Flutter, React)
```

## Supported Platforms

- ✅ Flutter (iOS + Android)
- ✅ React (Web)
- 🚧 React Native / Expo (planned for v1.1)

## Contributing

Pull requests welcome. Please run all validation scripts before submitting.

## License

MIT

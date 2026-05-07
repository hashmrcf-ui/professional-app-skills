# Professional App Skills

> A library of Agent Skills for building production-grade applications with enforced UX standards.
> Compatible with Claude Code, Cursor, Gemini CLI, Antigravity, and any agent supporting the [Agent Skills open standard](https://github.com/anthropics/skills).

---
**🤖 AGENT INSTRUCTIONS (FOR CLAUDE / AI):**
If the user has just asked you to load the "Professional App Builder" skill by cloning this repository and reading this README, you must do the following immediately:
1. Read the file `./skills/professional-app-builder/SKILL.md` to learn your new capabilities and rules.
2. Reply to the user (in Arabic) confirming that the skill has been successfully loaded.
3. Briefly summarize what you can now do (e.g., build professional Flutter/React apps with high UX standards).
4. **Immediately initiate Step 1 (Requirements Gathering)** as defined in the `SKILL.md` file by asking the user the first question to start building their app.
---

## Skills in This Library

| Skill | Description |
|---|---|
| [`professional-app-builder`](./skills/professional-app-builder) | Build complete Flutter or React apps with enforced UX rules: no emoji icons, 3-tap navigation, animated counters, RTL support, 8px grid spacing |

## Why This Library Exists

AI agents are great at generating code — but the code they generate often misses the details that separate amateur apps from professional ones:

- Emojis used as UI icons (looks cheap, breaks in dark mode)
- Deep nested navigation (5+ taps to reach features)
- Static numbers everywhere (feels dead)
- Hardcoded strings (no i18n, no RTL)
- Random spacing (no design system)

This library enforces solutions to these problems through **automated validators** that run on every build.

## Installation

### Quick install (one skill)

```bash
npx skills add <your-org>/professional-app-skills --skill professional-app-builder --global
```

### Manual install

```bash
git clone https://github.com/<your-org>/professional-app-skills.git
cp -r professional-app-skills/skills/professional-app-builder ~/.claude/skills/
```

## Usage Example

After installation, ask your agent:

```
Build me a Flutter app for a restaurant menu, in Arabic, with brown and gold colors.
The app should have a home screen, menu by category, and item details.
```

The agent will:
1. Confirm requirements (8 questions)
2. Show a structured plan and wait for approval
3. Set up theme, i18n, RTL, and shared components
4. Build each screen one at a time, asking for feedback
5. Run automated validators before declaring complete

## Skill Structure

Every skill in this library follows the open standard:

```
skill-name/
├── SKILL.md       # Mission control for the agent
├── README.md      # Human-facing docs
├── scripts/       # Automated validators (Node.js)
├── resources/     # Knowledge base (markdown)
├── examples/      # Gold-standard reference code
└── templates/     # Project starters
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT — see [LICENSE](./LICENSE).

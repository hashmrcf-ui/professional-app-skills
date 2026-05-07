# Contributing

Thanks for considering a contribution.

## Adding a New Skill

Every skill must follow this structure:

```
skills/your-skill-name/
├── SKILL.md       # Required — agent instructions
├── README.md      # Required — human-facing docs
├── scripts/       # Optional — validators
├── resources/     # Optional — markdown knowledge base
├── examples/      # Optional — reference implementations
└── templates/     # Optional — project starters
```

## SKILL.md Requirements

Every `SKILL.md` must start with frontmatter:

```yaml
---
name: skill-name
description: One-line description that an agent can pattern-match against user requests. Triggers on phrases like "...".
version: 1.0.0
license: MIT
---
```

## Validator Requirements

If you add validation scripts:

- Must be runnable as `node script.js <project-path>`
- Must exit `0` on success, `1` on failure, `2` on usage error
- Must print clear violation messages to stderr
- Must print success summary to stdout

## Pull Request Checklist

- [ ] New skill follows the standard folder structure
- [ ] `SKILL.md` has valid frontmatter
- [ ] All validator scripts have been tested on at least one good and one bad project
- [ ] README updated if a new skill is added
- [ ] No emoji used as icons in any example or template (eat your own dog food)

## Code Style

- Validators: plain Node.js, no external dependencies
- Markdown: ATX-style headings (`#` not underline), 80-100 char line limit soft target
- Examples: must build and run as-is

## Questions?

Open an issue on GitHub.

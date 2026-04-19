---
applyTo: "**/*.scss"
---

# SCSS Rules

> 📌 Minimal rules. For details: `.github/docs/css.reference.md`

## Non-negotiable rules

- ❌ No `::ng-deep` (legacy only with `// TODO: Remove`)
- ❌ No `!important` outside `src/styles/themes/`
- ❌ No hardcoded colors → use angular material tokens
- ❌ No `#id` selectors
- ❌ No "magic" z-index → use project tokens
- ✅ `:host` as the component root
- ✅ Selector depth ≤ 3 levels
- ✅ Naming BEM (`.block__element--modifier`)

## Complete reference

👉 `.github/skills/css-best-practices/references/css.reference.md`

## CSS / Accessibility Audit

👉 Use the `css-best-practices` skill

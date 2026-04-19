---
name: css-best-practices
description: "On css creation or to automatically review and validate all CSS code for accessibility, BEM conventions, and project standards"
---

# Skill — CSS Creation & Accessibility Review

## When to Use

Use this skill for any task involving CSS/SCSS: creation, modification, audit, refactoring, BEM compliance, WCAG AA review, or pre-PR verification.

## Instructions

1. Adopt the role of [CSS Agent](../../agents/css.agent.md)
2. Consult the detailed reference [CSS reference](./references/css.reference.md)
3. Produce a structured report:

### Expected output format

````markdown
## 📋 CSS or SCSS & Accessibility Report

### ❌ Non-compliances

- [ ] [Severity: Critical/Major/Minor] Description of the issue
  - File: `path/to/file.css`
  - Line: XX
  - Rule violated: [BEM|A11Y|Performance|Convention]

### ⚠️ Identified Risks

- Description of potential risk

### ✅ Compliant Points

- What is well done

### 🔧 Recommendations

1. Priority corrective action
2. Suggested improvement

### 📝 Proposed Fix (if applicable)

```css
// fixed code
```
````

## Constraints

- No unnecessary theory — be concise and actionable
- Normative decisions based on project reference
- Absolute priority to accessibility
- Propose concrete fixes, not just criticism

## Audit Checklist

- [ ] BEM naming respected
- [ ] No unjustified `::ng-deep`
- [ ] No `!important` outside themes
- [ ] Project tokens used (colors, z-index, spacing)
- [ ] `:host` used for isolation
- [ ] Selector depth ≤ 3
- [ ] `:focus-visible` on interactive elements
- [ ] Hover/focus/disabled states defined
- [ ] WCAG AA contrasts respected
- [ ] Keyboard navigation not broken

## Invocation Example

> "Audit the CSS of this component for BEM and accessibility compliance"
> "Check that this CSS file follows our project conventions"
> "Review CSS before PR"

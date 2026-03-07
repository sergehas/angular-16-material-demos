---
name: css-best-practices
description: "On css creation or to automatically review and validate all CSS code for accessibility, BEM conventions, and project standards"
---

# Skill — CSS Creation & Accessibility Review

## ⚠️ MANDATORY

**This skill MUST be used automatically for any task involving CSS:**

- ✅ Creation of new CSS files
- ✅ Modification of existing CSS files
- ✅ CSS audit of a component or file
- ✅ Accessibility review RGAA / WCAG AA
- ✅ CSS refactoring
- ✅ Pre-merge/PR verification
- ✅ BEM compliance analysis

## Instructions

1. **MANDATORY**: Adopt the role of CSS agent [AGENT CSS EXPERT](../../agents/css.agent.md)
2. **MANDATORY**: Consult the detailed reference [CSS REFERENCE](./references/css.reference.md)
3. Analyze the provided or to-be-created CSS code
4. Produce a structured report and **explicitly note in the chat that the CSS skill was used**:

### Expected output format

````markdown
## 📋 CSS & Accessibility Report

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

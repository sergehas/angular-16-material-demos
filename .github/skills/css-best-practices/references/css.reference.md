# CSS Reference — BEM & Accessibility

> 📌 **Source of truth** for CSS rules in the project with Angular material token.

---

## 1. Style Architecture

### DSA Tokens

```scss
/* ✅ CORRECT - Use Theme tokens */
.my-component {
  background: var(--mat-sys-primary-container);
  color: var(--mat-sys-on-primary-container);
  border: 1px solid var(--mat-sys-outline-variant);
  font: var(--mat-sys-body-large);
}

/* ❌ FORBIDDEN - Hardcoded values */
.my-component {
  font: 14px Arial;
  color: #663399;
  padding: 20px;
}
```

---

## 2. BEM Naming

### Convention

```scss
.block {
}
.block--modifier {
}
.block__element--modifier {
}
```

### Examples

```scss
// ✅ CORRECT
.user-card {
}
.user-card__avatar {
}
.user-card__name {
}
.user-card--highlighted {
}

// ❌ AVOID
.userCard {
} // camelCase
.user-card .avatar {
} // implicit cascade
.user-card-avatar {
} // no BEM separator
```

### Angular Rule

One component = one BEM block. The block name matches the component selector.

---

## 3. Angular Component Styles

### Isolation with host selectors

```css
/* ✅ Pure CSS in apps */
  display: block;
  font: var(--mat-sys-body-large);
}

:host([disabled]) {
  opacity: 0.5;
  pointer-events: none;
}

:host(.compact) {
  border-radius: var(--mat-sys-corner-large);
}
```

```scss
// ✅ SCSS in libs only
:host {
  display: block;

  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  &.compact {
    padding: 0.5rem;
  }
}
```

### Maximum depth: 3 levels

```css
/* ✅ CORRECT */
.block__element .nested-item {
  color: var(--mat-sys-on-surface-variant);
}

/* ❌ AVOID (too deep) */
.block .element .child .grandchild {
}
```

---

## 4. Accessibility RGAA / WCAG AA

### 4.1 Visible focus (MANDATORY)

```css
/* ✅ CORRECT */
  outline: 2px solid var(--mat-sys-primary);
  box-shadow: var(--mat-sys-level4);
}

/* ❌ FORBIDDEN */
.interactive-element {
  outline: none; /* Never without an alternative! */
}
```

### 4.2 Contrast

| Element                         | Minimum ratio |
| ------------------------------- | ------------- |
| Normal text                     | 4.5:1         |
| Large text (18px+ or 14px bold) | 3:1           |
| UI components, icons            | 3:1           |

### 4.3 Keyboard navigation

- Never visually hide a focusable element
- `tabindex` managed in HTML, not CSS
- No `pointer-events: none` on interactive elements

### 4.4 Accessibility media queries

```css
:root {
  {
/* Respect user preferences */
    transition: none !important;
  }
}

@media (prefers-contrast: more) {
  .subtle-text {
    color: var(color: var(--mat-sys-on-primary));

  }
}
```

---

## 5. Mandatory visual states

Every interactive element MUST define:

```css
.interactive-element {
  background: var(--mat-sys-surface-container);

  /* Hover */
}
.interactive-element:hover {
  background: var(--mat-sys-background);
}

/* Keyboard focus */
.interactive-element:focus-visible {
  outline: 2px solid var(--mat-sys-primary);
}

/* Active (click) */
.interactive-element:active {
  background: var(--mat-sys-primary);
}

/* Disabled */
.interactive-element:disabled,
.interactive-element[aria-disabled="true"] {
  background: color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent)
  color: color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent)
  cursor: not-allowed;
}
```

### Customization with CSS custom properties

```css
/* ✅ CORRECT - Customization via CSS custom properties */
.my-tab-group {
  --tab-group-padding-inline: calc(var(--app-gap)/2);
}

.my-icon-button::part(base) {
  font: var(--mat-tab-label-text-size, var(--mat-sys-title-small-size));
  height: var(--mat-tab-container-height;
}
```

### CNSA Design System

- Use `::part()` to target internal parts of web components
- Prefer CSS custom properties (`--mat-*`) over hardcoded values
- Never use `::ng-deep` (FORBIDDEN)

---

## 7. Anti-patterns

| `#id-selector` | `.class-selector` |
| `::ng-deep` | **FORBIDDEN** - Use `::part()` or CSS custom properties |
| `outline: none` | `:focus-visible` with outline |
| Hardcoded colors/sizes | DSA tokens `--mat-*` |
| Selectors > 3 levels | Restructure BEM |
| `* { }` global | Target specifically |
| SCSS in apps | Pure CSS only |

---

## 8. Before / After Examples

### Example 1: Accessible button

```css
/* ❌ BEFORE */
  background: #007bff;
  color: white;
  outline: none;
}

/* ✅ AFTER */
.btn {
  background: var(--mat-sys-primary-container);
  color: var(--mat-sys-on-primary-container);
  font: var(--mat-sys-label-large-font);
}

.btn:hover {
  box-shadow: var(--mat-sys-level4);
}

.btn:focus-visible {
  outline: 2px solid var(--mat-sys-primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Example 2: Card BEM

```css
/* ❌ BEFORE */
.card .header .title {
}
.card .content p {
}

/* ✅ AFTER */
.card {
}
.card__header {
}
.card__title {
  font: var(--mat-sys-title-medium-font);
}
.card__content {
  padding: calc(var(--app-gap) / 4);
}
.card--featured {
}
```

---

## 9. Code Review Checklist

- [ ] No `::ng-deep` (FORBIDDEN)
- [ ] No `!important` except justified emergency
- [ ] DSA tokens used (`--dsa-*`)
- [ ] No duplication of existing styles
- [ ] Pure CSS in apps, SCSS only in libs
- [ ] No hardcoded colors/sizes
- [BEM Methodology](http://getbem.com/)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [RGAA 4.1](https://accessibilite.numerique.gouv.fr/methode/criteres-et-tests/)
- [Design System Autonomy](https://storybook.design-system.cnsa.fr/)

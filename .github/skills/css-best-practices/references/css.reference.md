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
  color: var(--dsa-color-primitive-colors-identity-purple-500);
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
  outline: 2px solid var(--dsa-color-focus, #005fcc);
  outline-offset: 2px;
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
/* Respect user preferences */
    transition: none !important;
  }
}

@media (prefers-contrast: more) {
  .subtle-text {
    color: var(--dsa-color-text-primary);
  }
}
```

---

## 5. Mandatory visual states

Every interactive element MUST define:

```css
.interactive-element {
  background: var(--dsa-color-bg-default);

  /* Hover */
}
.interactive-element:hover {
  background: var(--dsa-color-bg-hover);
}

/* Keyboard focus */
.interactive-element:focus-visible {
  outline: 2px solid var(--dsa-color-focus);
}

/* Active (click) */
.interactive-element:active {
  background: var(--dsa-color-bg-active);
}

/* Disabled */
.interactive-element:disabled,
.interactive-element[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Customization with CSS custom properties

```css
/* ✅ CORRECT - Customization via CSS custom properties */
dsa-tab-group {
  --tab-group-padding-inline: var(--dsa-spacing-80);
}

dsa-icon-button::part(base) {
  font: var(--dsa-wc-button-font);
  height: var(--dsa-wc-form-input-height);
  width: var(--dsa-wc-form-input-width);
  gap: var(--dsa-spacing-8);
}
```

### CNSA Design System

- Use `::part()` to target internal parts of web components
- Prefer CSS custom properties (`--dsa-*`) over hardcoded values
- Never use `::ng-deep` (FORBIDDEN)

---

## 7. Anti-patterns

| `#id-selector` | `.class-selector` |
| `::ng-deep` | **FORBIDDEN** - Use `::part()` or CSS custom properties |
| `outline: none` | `:focus-visible` with outline |
| Hardcoded colors/sizes | DSA tokens `--dsa-*` |
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
  background: var(--dsa-color-bg-primary);
  color: var(--dsa-color-text-on-primary);
  font: var(--dsa-wc-button-font);
}

.btn:hover {
  background: var(--dsa-color-bg-primary-hover);
}

.btn:focus-visible {
  outline: 2px solid var(--dsa-color-focus);
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
  font: var(--dsa-font-heading-small);
}
.card__content {
  padding: var(--dsa-spacing-16);
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

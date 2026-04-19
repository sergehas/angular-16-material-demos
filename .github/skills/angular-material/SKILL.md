---
name: angular-material
description: 'Angular Material UI components, theming, and accessible interface design. Create new Angular material components by following official documentation. Use when asked to "create a material feature", "make a new component".'
metadata:
  tags: ["Angular Material", "UI Components", "Theming"]
---

# Angular Material Skill

## When to Use

Load this skill when: creating a new component with Angular Material UI, using Material theming tokens, working with CDK utilities, or auditing accessibility of Material components.

## How to Create a Material Component

1. Import the specific Material module (never `MatAllModule`):

```typescript
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";

@Component({
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule],
})
```

2. Use the Angular Material component selector in the template:

```html
<mat-form-field appearance="outline">
  <mat-label>Label</mat-label>
  <input matInput placeholder="Value" />
</mat-form-field>
<button mat-raised-button color="primary">Save</button>
```

## Theming — Use Tokens, Never Hardcode Colors

```scss
// ✅ Use Material M3 tokens
color: var(--mat-sys-primary);
background: var(--mat-sys-surface);

// ❌ Never hardcode
color: #1976d2;
```

## Key Component Patterns

| Need       | Component                       | Import                                 |
| ---------- | ------------------------------- | -------------------------------------- |
| Text input | `<mat-form-field>` + `matInput` | `MatFormFieldModule`, `MatInputModule` |
| Select     | `<mat-select>`                  | `MatSelectModule`                      |
| Table      | `<mat-table>`                   | `MatTableModule`                       |
| Dialog     | `MatDialog.open()`              | `MatDialogModule`                      |
| Snackbar   | `MatSnackBar.open()`            | `MatSnackBarModule`                    |
| Icons      | `<mat-icon>`                    | `MatIconModule`                        |
| Sidenav    | `<mat-sidenav-container>`       | `MatSidenavModule`                     |

## Accessibility Checklist

- [ ] All form fields have `<mat-label>` or `aria-label`
- [ ] Interactive elements are keyboard-reachable
- [ ] Color contrast meets WCAG AA (use Material M3 tokens — they comply by default)
- [ ] `mat-icon` buttons have `aria-label`
- [ ] Use `MatRipple` or `mat-button` variants for interactive surfaces (not raw `<div>`)

## CDK Quick Reference

- **Overlay**: `Overlay` service — for custom positioned panels
- **Drag & Drop**: `CdkDragDrop`, `cdkDrag` directive
- **Virtual Scroll**: `<cdk-virtual-scroll-viewport>` for large lists
- **A11y**: `FocusTrap`, `LiveAnnouncer` for accessible interactions

## Reference Documentation

- [Angular Material Components](https://v21.material.angular.dev/components)
- [Theming Guide](https://material.angular.dev/guide/theming)
- [CDK Overview](https://v21.material.angular.dev/cdk)
- [Accessibility](https://v21.material.angular.dev/cdk/a11y/overview)
- [Component Tokens](https://material.angular.dev/guide/theming#component-tokens)

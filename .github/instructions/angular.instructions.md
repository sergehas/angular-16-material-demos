---
description: "Angular-specific coding standards and best practices"
applyTo: "**/*.ts, **/*.html, **/*.scss, **/*.css"
---

# Angular Development Instructions

> For project layout, commands, and conventions see [`copilot-instructions.md`](../copilot-instructions.md).
> Style guide: https://angular.dev/style-guide

## Component Design

- Use standalone components by default; use modules only when explicitly required.
- Use `input()`, `output()`, `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()` signal-based functions (Angular 19+); use decorators for older components.
- Apply `ChangeDetectionStrategy.OnPush` to all new components.
- Keep templates free of logic — move it to the component class or a service.
- Prefer `async` pipe over manual subscriptions in templates.

## State Management

- Use `signal()`, `computed()`, and `effect()` for component-level reactive state.
- Use `AsyncPipe` when bridging RxJS observables with template rendering.
- For service-level shared state, use `BehaviorSubject` or `signal()` in a `core/` service.

## Security

- Never manipulate the DOM directly — use Angular's DI and built-in sanitization.
- Use route guards for authentication/authorization.
- Validate all form inputs with Angular reactive forms and custom validators.

## Accessibility & i18n

- Use semantic HTML and ARIA attributes (WCAG 2.1 AA).
- All user-visible strings must use `@ngx-translate` — no hardcoded UI text.

## Testing

- Unit tests: Jasmine/Karma with `TestBed`. Place `.spec.ts` files alongside the source.
- Mock HTTP with `provideHttpClientTesting`. Target ≥ 80% branch coverage.
- E2E tests: Playwright in `e2e/`. See `playwright-typescript.instructions.md`.

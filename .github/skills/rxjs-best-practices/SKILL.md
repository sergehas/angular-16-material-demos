---
name: rxjs-best-practices
description: "Complete RxJS patterns and best practices for Angular: subscription management, error handling, operators usage, anti-patterns to avoid. Use when working with observables, HTTP requests, subscriptions, async operations, memory leaks, or RxJS-related Angular patterns."
---

# RxJS Best Practices

## Quick Rules

1. **Always terminate long-lived subscriptions** — use `takeUntilDestroyed(this.destroyRef)` in components/directives.
2. **Never nest `subscribe()` calls** — flatten with `switchMap`, `mergeMap`, `concatMap`, or `exhaustMap`.
3. **Never subscribe inside loops** — use `forkJoin` or `mergeMap` with an array.
4. **Always handle errors in the pipeline** — use `catchError` and return `EMPTY` or a fallback.
5. **Cache repeated HTTP calls** — use `shareReplay({ bufferSize: 1, refCount: true })`.
6. **Complete subjects in `ngOnDestroy`** — call `.complete()` to free memory.
7. **Prefer `async` pipe** over manual subscriptions in templates.

## Operator Quick Reference

| Operator               | Use When                     | Example Use Case    |
| ---------------------- | ---------------------------- | ------------------- |
| `switchMap`            | Cancel previous, use latest  | Search, navigation  |
| `mergeMap`             | All in parallel              | Batch data loading  |
| `exhaustMap`           | Ignore new during execution  | Form submit         |
| `concatMap`            | Sequential order matters     | Ordered operations  |
| `forkJoin`             | Wait for all to complete     | Parallel HTTP       |
| `combineLatest`        | Latest from multiple streams | Reactive state      |
| `take(1)`              | One emission only            | Dialogs, snapshots  |
| `distinctUntilChanged` | Skip duplicates              | Performance         |
| `shareReplay`          | Cache and share              | HTTP response cache |

## Pre-commit Checklist

- [ ] All subscriptions have `takeUntilDestroyed()`, `take(1)`, or explicit cleanup
- [ ] No nested subscriptions — use operators
- [ ] No subscriptions in loops — use `forkJoin`/`mergeMap`
- [ ] All observables have `catchError`
- [ ] Subjects completed in `ngOnDestroy`
- [ ] HTTP caching with `shareReplay` where appropriate
- [ ] `async` pipe preferred in templates

## Detailed Reference Documentation

| Topic                   | File                                                                             |
| ----------------------- | -------------------------------------------------------------------------------- |
| Subscription Management | [references/subscription-management.md](./references/subscription-management.md) |
| Operators Guide         | [references/operators-guide.md](./references/operators-guide.md)                 |
| Error Handling          | [references/error-handling.md](./references/error-handling.md)                   |
| State Management        | [references/state-management.md](./references/state-management.md)               |
| Anti-Patterns           | [references/anti-patterns.md](./references/anti-patterns.md)                     |
| Testing                 | [references/testing.md](./references/testing.md)                                 |
| Performance             | [references/performance.md](./references/performance.md)                         |

## External Resources

- [Angular RxJS Interop](https://angular.dev/ecosystem/rxjs-interop)
- [RxJS Documentation](https://rxjs.dev/)
- [RxJS Marbles](https://rxmarbles.com/)

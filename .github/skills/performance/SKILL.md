---
name: performance
description: "Angular performance optimization: bundle size, lazy loading, OnPush, trackBy, signal optimization, change detection. Use when asked to 'optimize', 'reduce bundle size', 'improve performance', or 'lazy load'."
---

# Performance Skill

## Change Detection — OnPush

Apply `ChangeDetectionStrategy.OnPush` to all components. Only use `markForCheck()` to trigger re-renders:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  private cdr = inject(ChangeDetectorRef);

  onAsyncEvent(): void {
    // Notify Angular the view needs updating
    this.cdr.markForCheck();
  }
}
```

> ❌ Avoid `detectChanges()` — it runs change detection on the subtree immediately (expensive).

## Lazy Loading Routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: "feature",
    loadChildren: () => import("./features/feature/feature.routes").then((m) => m.FEATURE_ROUTES),
  },
];
```

## trackBy in Lists

```html
<!-- ✅ Always use trackBy for lists that change -->
@for (item of items; track item.id) {
<app-item [data]="item" />
}
```

For `*ngFor` (legacy only):

```typescript
trackById(index: number, item: Item): number {
  return item.id;
}
```

## Signals vs. Observables — Performance

| Scenario               | Prefer                 | Reason                                               |
| ---------------------- | ---------------------- | ---------------------------------------------------- |
| Simple component state | `signal()`             | Fine-grained reactivity, no subscription overhead    |
| Derived state          | `computed()`           | Memoized, re-evaluates only when dependencies change |
| HTTP, streams, events  | `Observable`           | RxJS operators, better async flow control            |
| Template binding       | `async` pipe or signal | Both work; signals avoid zone.js triggering          |

## Bundle Size

- Import only specific Material modules (never `MatAllModule`)
- Use lazy-loaded routes for all features
- Check bundle with: `npm run build -- --stats-json && npx webpack-bundle-analyzer dist/stats.json`
- Avoid `import * as _ from 'lodash'` — import individual functions

## Performance Checklist

- [ ] All components use `ChangeDetectionStrategy.OnPush`
- [ ] Feature routes are lazy-loaded
- [ ] `trackBy` / `track` used in all `*ngFor` / `@for` loops
- [ ] No `detectChanges()` added (use `markForCheck()`)
- [ ] Material modules imported individually
- [ ] HTTP responses cached with `shareReplay` where appropriate
- [ ] No synchronous heavy computation in templates

## Reference

- [Angular Performance Guide](https://angular.dev/best-practices/runtime-performance)
- [Change Detection](https://angular.dev/best-practices/skipping-subtrees)
- [Lazy Loading](https://angular.dev/guide/routing/lazy-loading-ngmodules)

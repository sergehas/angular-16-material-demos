# RxJS Anti-Patterns - Avoid at All Costs

## 🚫 Subscription Without Cleanup

### ❌ FORBIDDEN: No takeUntilDestroyed

```ts
@Component({...})
export class LeakyComponent {
  ngOnInit() {
    // ❌ Guaranteed memory leak
    this.service.getData().subscribe(data => this.data = data);

    // ❌ Each navigation creates a new subscription
    this.userService.currentUser$.subscribe(user => this.user = user);
  }
}
```

### ✅ CORRECT: Always Clean Up

```ts
@Component({...})
export class CleanComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 Constructor Subscription Without Cleanup

### ❌ FORBIDDEN

```ts
@Component({...})
export class BadConstructorComponent {
  constructor(private service: DataService) {
    // ❌ Subscription never cleaned up
    this.service.getData().subscribe(data => this.data = data);
  }
}
```

### ✅ CORRECT

```ts
@Component({...})
export class GoodConstructorComponent {
  private destroyRef = inject(DestroyRef);

  constructor(private service: DataService) {
    // ✅ Automatic cleanup
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 Subscribe Inside a Loop

### ❌ FORBIDDEN: Creates N untracked subscriptions

```ts
@Component({...})
export class LoopSubscribeComponent {
  loadItems(items: Item[]): void {
    // ❌ Creates a subscription per item, none cleaned up
    items.forEach(item => {
      this.service.getDetail(item.id).subscribe(detail => {
        item.detail = detail;
      });
    });
  }
}
```

### ✅ CORRECT: Use forkJoin or mergeMap

```ts
@Component({...})
export class CorrectBatchComponent {
  private destroyRef = inject(DestroyRef);

  loadItems(items: Item[]): void {
    // ✅ Single subscription, automatic cleanup
    forkJoin(items.map(item => this.service.getDetail(item.id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(details => {
        items.forEach((item, index) => item.detail = details[index]);
      });
  }
}
```

## 🚫 Double Subscription (async pipe + subscribe)

### ❌ FORBIDDEN: Double subscription

```ts
@Component({
  template: `
    <!-- ❌ First subscription via async pipe -->
    <div *ngIf="data$ | async as data">{{ data.length }} items</div>
  `,
})
export class DoubleSubscriptionComponent {
  data$ = this.service.getData();

  ngOnInit() {
    // ❌ Second subscription on the same stream!
    this.data$.subscribe((data) => console.log("Data loaded:", data));
  }
}
```

### ✅ CORRECT: Single method

```ts
@Component({
  template: `
    <!-- ✅ Only one subscription via async pipe -->
    <div *ngIf="data$ | async as data">{{ data.length }} items</div>
  `,
})
export class SingleSubscriptionComponent {
  private destroyRef = inject(DestroyRef);

  // ✅ shareReplay to share the subscription if needed
  data$ = this.service.getData().pipe(
    tap((data) => console.log("Data loaded:", data)),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
```

## 🚫 Subject Without complete()

### ❌ FORBIDDEN: Subject never completed

```ts
@Injectable({ providedIn: "root" })
export class LeakySubjectService {
  private mySubject = new Subject<string>();
  data$ = this.mySubject.asObservable();

  // ❌ No ngOnDestroy, subject is never completed
  emit(value: string): void {
    this.mySubject.next(value);
  }
}
```

### ✅ CORRECT: Always Complete

```ts
@Injectable({ providedIn: "root" })
export class CleanSubjectService implements OnDestroy {
  private mySubject = new Subject<string>();
  data$ = this.mySubject.asObservable();

  emit(value: string): void {
    this.mySubject.next(value);
  }

  ngOnDestroy(): void {
    // ✅ REQUIRED
    this.mySubject.complete();
  }
}
```

## 🚫 Nested Subscriptions (Callback Hell)

### ❌ FORBIDDEN: Nested subscriptions

```ts
@Component({...})
export class CallbackHellComponent {
  loadData(): void {
    // ❌ 3 levels of nested subscriptions
    this.route.params.subscribe(params => {
      this.service1.getData(params['id']).subscribe(data1 => {
        this.service2.getRelated(data1.code).subscribe(data2 => {
          this.data = data2; // 😱 Maintenance nightmare
        });
      });
    });
  }
}
```

### ✅ CORRECT: Pipeline with operators

```ts
@Component({...})
export class CleanPipelineComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    // ✅ Clean and readable pipeline
    this.route.params
      .pipe(
        switchMap(params => this.service1.getData(params['id'])),
        switchMap(data1 => this.service2.getRelated(data1.code)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 Subscribe Inside Subscribe

### ❌ FORBIDDEN: Nested subscription

```ts
@Component({...})
export class NestedComponent {
  saveData(): void {
    // ❌ Nested subscribe
    this.userService.getCurrentUser().subscribe(user => {
      this.dataService.save(this.data, user.id).subscribe(result => {
        this.handleResult(result);
      });
    });
  }
}
```

### ✅ CORRECT: switchMap

```ts
@Component({...})
export class FlattenedComponent {
  private destroyRef = inject(DestroyRef);

  saveData(): void {
    // ✅ Flattened pipeline
    this.userService.getCurrentUser()
      .pipe(
        switchMap(user => this.dataService.save(this.data, user.id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => this.handleResult(result));
  }
}
```

## 🚫 Data Mutation Inside subscribe

### ❌ FORBIDDEN: Direct mutation

```ts
@Component({...})
export class MutatingComponent {
  items: Item[] = [];

  loadItems(): void {
    this.service.getItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newItems => {
        // ❌ Mutation of existing data
        newItems.forEach(item => {
          item.loaded = true;
          this.items.push(item);
        });
      });
  }
}
```

### ✅ CORRECT: Immutability

```ts
@Component({...})
export class ImmutableComponent {
  private destroyRef = inject(DestroyRef);
  items: Item[] = [];

  loadItems(): void {
    this.service.getItems()
      .pipe(
        map(items => items.map(item => ({ ...item, loaded: true }))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(newItems => {
        // ✅ Creates a new array
        this.items = [...this.items, ...newItems];
      });
  }
}
```

## 🚫 Public BehaviorSubject

### ❌ FORBIDDEN: Subject exposed directly

```ts
@Injectable({ providedIn: "root" })
export class BadStateService {
  // ❌ Anyone can call .next() from outside
  data$ = new BehaviorSubject<Data[]>([]);
}

// Usage:
// service.data$.next([]) // 💀 Anywhere in the app!
```

### ✅ CORRECT: Private subject, public observable

```ts
@Injectable({ providedIn: "root" })
export class GoodStateService implements OnDestroy {
  // ✅ Private
  private readonly _data$ = new BehaviorSubject<Data[]>([]);

  // ✅ Read-only public
  readonly data$ = this._data$.asObservable();

  setData(data: Data[]): void {
    this._data$.next(data);
  }

  ngOnDestroy(): void {
    this._data$.complete();
  }
}
```

## 🚫 subscribe() Without Error Handling

### ❌ FORBIDDEN: No catchError

```ts
@Component({...})
export class NoErrorHandlingComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    // ❌ On HTTP error, stream dies and loading stays true
    this.loading = true;
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        this.data = data;
        this.loading = false;
      });
  }
}
```

### ✅ CORRECT: Always handle errors

```ts
@Component({...})
export class ErrorHandlingComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.loading = true;

    this.service.getData()
      .pipe(
        catchError(err => {
          this.error = err.message;
          return of([]);
        }),
        finalize(() => this.loading = false),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 Incorrect Operator Order

### ❌ FORBIDDEN: takeUntilDestroyed after finalize

```ts
@Component({...})
export class WrongOrderComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.loading = true;

    this.service.getData()
      .pipe(
        finalize(() => this.loading = false),
        takeUntilDestroyed(this.destroyRef) // ❌ Too late!
      )
      .subscribe(data => this.data = data);
  }
}
```

### ✅ CORRECT: Logical order

```ts
@Component({...})
export class CorrectOrderComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.loading = true;

    this.service.getData()
      .pipe(
        catchError(err => of([])),      // 1. Error handling
        finalize(() => this.loading = false), // 2. Cleanup
        takeUntilDestroyed(this.destroyRef)  // 3. Unsubscribe
      )
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 Business Logic Inside subscribe

### ❌ FORBIDDEN: Processing inside subscribe

```ts
@Component({...})
export class LogicInSubscribeComponent {
  loadData(): void {
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // ❌ Complex business logic inside subscribe
        const filtered = data.filter(item => item.active);
        const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
        const grouped = this.groupByCategory(sorted);
        this.data = grouped;
      });
  }
}
```

### ✅ CORRECT: Logic in the pipeline

```ts
@Component({...})
export class LogicInPipelineComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.service.getData()
      .pipe(
        // ✅ Keep all logic in the pipeline
        map(data => data.filter(item => item.active)),
        map(data => data.sort((a, b) => a.name.localeCompare(b.name))),
        map(data => this.groupByCategory(data)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 subscribe() with Side Effects

### ❌ FORBIDDEN: Side effects in map

```ts
this.service
  .getData()
  .pipe(
    map((data) => {
      // ❌ Side effect in map
      console.log("Data loaded:", data);
      this.showNotification("Success");
      return data;
    }),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((data) => (this.data = data));
```

### ✅ CORRECT: Use tap for side effects

```ts
this.service
  .getData()
  .pipe(
    // ✅ tap for side effects
    tap((data) => console.log("Data loaded:", data)),
    tap(() => this.showNotification("Success")),
    map((data) => data), // map only for transformations
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((data) => (this.data = data));
```

## Anti-Patterns Summary

| Anti-Pattern                 | Why it is bad             | Solution                         |
| ---------------------------- | ------------------------- | -------------------------------- |
| Subscription without cleanup | Memory leak               | `takeUntilDestroyed()`           |
| Subscribe inside loop        | N untracked subscriptions | `forkJoin` or `mergeMap`         |
| Nested subscriptions         | Unreadable code, leaks    | `switchMap`, `mergeMap`          |
| Public subject               | No encapsulation          | Private subject + asObservable() |
| No catchError                | Stream dies on error      | Always use `catchError`          |
| Double subscription          | Duplicate requests        | `shareReplay` or async pipe only |
| Logic inside subscribe       | Hard to test              | Move logic into pipe with `map`  |
| Subject without complete()   | Memory leak               | `complete()` in ngOnDestroy      |

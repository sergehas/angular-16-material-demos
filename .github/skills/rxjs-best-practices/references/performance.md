# RxJS Performance & Optimization

## HTTP Response Caching with shareReplay

### Basic Pattern

```ts
@Injectable({ providedIn: "root" })
export class ConfigService {
  private http = inject(HttpClient);

  // ✅ Caches the HTTP response, shared across all subscribers
  private config$ = this.http.get<Config>("/api/config").pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getConfig(): Observable<Config> {
    return this.config$; // Reuses the same request
  }
}
```

**Explanation:**

- `bufferSize: 1`: Keeps the latest value in cache
- `refCount: true`: Releases the cache when there are no subscribers left

### Example with Cache Invalidation

```ts
@Injectable({ providedIn: "root" })
export class CachedDataService {
  private http = inject(HttpClient);
  private cacheInvalidator$ = new Subject<void>();

  // Cache recreated on each invalidation
  private data$ = this.cacheInvalidator$.pipe(
    startWith(undefined),
    switchMap(() => this.http.get<Data[]>("/api/data").pipe(shareReplay({ bufferSize: 1, refCount: true })))
  );

  getData(): Observable<Data[]> {
    return this.data$;
  }

  invalidateCache(): void {
    this.cacheInvalidator$.next(); // Force a new fetch
  }
}
```

## distinctUntilChanged: Avoid Redundant Emissions

### Simple Use Case

```ts
@Component({...})
export class OptimizedComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.userService.currentUser$
      .pipe(
        map(user => user.id),
        distinctUntilChanged(), // Only emits if ID changes
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(userId => {
        this.loadUserData(userId); // Only called if userId changes
      });
  }
}
```

### With Custom Comparator

```ts
interface User {
  id: string;
  name: string;
  lastModified: Date;
}

@Component({...})
export class CustomComparatorComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.userService.currentUser$
      .pipe(
        // Compares only the ID, ignores other changes
        distinctUntilChanged((prev, curr) => prev.id === curr.id),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(user => {
        this.renderUser(user);
      });
  }
}
```

## Optimizing Lists with trackBy

### Without trackBy (Slow)

```ts
@Component({
  template: `
    <!-- ❌ Recreates all DOM elements on each change -->
    <div *ngFor="let item of items$ | async">
      {{ item.name }}
    </div>
  `,
})
export class SlowListComponent {
  items$ = this.service.items$;
}
```

### With trackBy (Fast)

```ts
@Component({
  template: `
    <!-- ✅ Updates only changed elements -->
    <div *ngFor="let item of items$ | async; trackBy: trackById">
      {{ item.name }}
    </div>
  `,
})
export class FastListComponent {
  items$ = this.service.items$;

  trackById = (index: number, item: Item) => item.id;
}
```

## auditTime vs debounceTime

### debounceTime: Wait for Activity to Stop

```ts
@Component({...})
export class SearchComponent {
  private destroyRef = inject(DestroyRef);
  searchControl = new FormControl('');

  ngOnInit(): void {
    // ✅ Waits 300ms after the last keystroke
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Perfect for search
        distinctUntilChanged(),
        switchMap(term => this.searchService.search(term)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(results => this.results = results);
  }
}
```

### auditTime: Sample Periodically

```ts
@Component({...})
export class ScrollComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // ✅ Emits at most every 100ms while scrolling
    fromEvent(window, 'scroll')
      .pipe(
        auditTime(100), // More performant than throttleTime
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.updateScrollPosition();
      });
  }
}
```

## OnPush Change Detection

### Combining with Observables

```ts
@Component({
  selector: "app-optimized",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ✅ async pipe triggers change detection automatically -->
    <div *ngIf="data$ | async as data">
      {{ data.name }}
    </div>
  `,
})
export class OptimizedComponent {
  data$ = this.service.data$;
}
```

### With markForCheck for Manual Subscriptions

```ts
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>{{ data?.name }}</div>`,
})
export class ManualCheckComponent {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  data: Data | null = null;

  ngOnInit(): void {
    this.service.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.data = data;
      this.cdr.markForCheck(); // ✅ Triggers change detection
    });
  }
}
```

## Limiting Concurrency with mergeMap

### Without Limit (Problematic)

```ts
// ❌ Could fire 1000 simultaneous requests
from(items)
  .pipe(
    mergeMap((item) => this.http.get(`/api/items/${item.id}`)),
    toArray()
  )
  .subscribe((results) => console.log(results));
```

### With Concurrency Limit

```ts
// ✅ Maximum 5 simultaneous requests
from(items)
  .pipe(
    mergeMap(
      (item) => this.http.get(`/api/items/${item.id}`),
      5 // Max concurrency
    ),
    toArray(),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((results) => (this.results = results));
```

## Strategic Unsubscribe with take

### Case: First Result is Enough

```ts
@Component({...})
export class FirstResultComponent {
  loadInitialData(): void {
    // ✅ Automatically unsubscribes after 1 value
    this.service.getData()
      .pipe(take(1))
      .subscribe(data => this.data = data);
  }
}
```

### Case: First N Values

```ts
@Component({...})
export class LimitedResultsComponent {
  private destroyRef = inject(DestroyRef);

  loadRecentNotifications(): void {
    // ✅ Takes only the first 10 notifications
    this.notificationService.stream$
      .pipe(
        take(10),
        toArray(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(notifications => {
        this.notifications = notifications;
      });
  }
}
```

## Batching with bufferTime

### Grouping Emissions

```ts
@Injectable({ providedIn: "root" })
export class BatchedLoggerService {
  private destroyRef = inject(DestroyRef);
  private logSubject = new Subject<LogEntry>();

  constructor() {
    // ✅ Sends logs in batches every 5 seconds
    this.logSubject
      .pipe(
        bufferTime(5000),
        filter((logs) => logs.length > 0),
        switchMap((logs) => this.http.post("/api/logs", logs)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  log(entry: LogEntry): void {
    this.logSubject.next(entry);
  }
}
```

## Lazy Loading with defer

### Create the Observable on Demand

```ts
@Injectable({ providedIn: "root" })
export class LazyDataService {
  // ✅ The factory runs only on subscription
  getData(): Observable<Data> {
    return defer(() => {
      console.log("Creating observable NOW");
      return this.http.get<Data>("/api/data");
    });
  }
}
```

## Avoid Leaks with share

### Problem: Multiple Subscriptions

```ts
// ❌ Creates 2 distinct HTTP requests
const data$ = this.http.get("/api/data");

data$.subscribe((d) => console.log("Subscriber 1:", d));
data$.subscribe((d) => console.log("Subscriber 2:", d));
```

### Solution: share() or shareReplay()

```ts
// ✅ A single shared HTTP request
const data$ = this.http.get("/api/data").pipe(shareReplay({ bufferSize: 1, refCount: true }));

data$.subscribe((d) => console.log("Subscriber 1:", d));
data$.subscribe((d) => console.log("Subscriber 2:", d));
```

## Memory Profiling

### Check for Memory Leaks

```ts
// In development, monitor subscriptions
@Component({...})
export class MonitoredComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  ngOnInit(): void {
    console.log('Component created');

    this.subscriptions.add(
      this.service.data$.subscribe(data => {
        console.log('Data received');
      })
    );
  }

  ngOnDestroy(): void {
    console.log('Component destroyed');
    this.subscriptions.unsubscribe();

    // Verify that closed = true
    console.log('Subscriptions closed:', this.subscriptions.closed);
  }
}
```

## Performance Strategy Comparison

| Technique                | Use Case                 | Performance Gain                |
| ------------------------ | ------------------------ | ------------------------------- |
| `shareReplay()`          | HTTP cache               | Avoids duplicate requests       |
| `distinctUntilChanged()` | Filter duplicates        | Reduces calculations/re-renders |
| `debounceTime()`         | User input               | Reduces API calls               |
| `auditTime()`            | Frequent events (scroll) | Limits frequency                |
| `take(1)`                | One-shot observable      | Immediate unsubscribe           |
| `mergeMap(_, n)`         | Parallel requests        | Limits server load              |
| `trackBy`                | ngFor                    | Optimizes DOM updates           |
| OnPush                   | Change detection         | Reduces CD cycles               |

## Best Practices

1. **Cache with `shareReplay()`** for rarely changing data
2. **Use `distinctUntilChanged()`** systematically on frequent streams
3. **Use `debounceTime()` for inputs** (search, filters)
4. **Use `auditTime()` for events** (scroll, resize, mouse move)
5. **Require `trackBy`** in ngFor with observables
6. **OnPush + async pipe** for pure components
7. **Limit concurrency** in `mergeMap` for batches
8. **Use `take(1)` or `first()`** for one-shot observables

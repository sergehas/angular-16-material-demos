# State Management with RxJS

## Service with BehaviorSubject

### Complete Pattern

```ts
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class ProductLineStateService implements OnDestroy {
  // ✅ Private BehaviorSubject with initial value
  private readonly _productLine$ = new BehaviorSubject<ProductLine | null>(null);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _error$ = new BehaviorSubject<string | null>(null);

  // ✅ Read-only public observables
  readonly productLine$: Observable<ProductLine | null> = this._productLine$.asObservable();
  readonly loading$: Observable<boolean> = this._loading$.asObservable();
  readonly error$: Observable<string | null> = this._error$.asObservable();

  // ✅ Synchronous getter when needed
  get currentProductLine(): ProductLine | null {
    return this._productLine$.getValue();
  }

  // Methods
  setProductLine(productLine: ProductLine): void {
    this._productLine$.next(productLine);
    this._error$.next(null);
  }

  setLoading(loading: boolean): void {
    this._loading$.next(loading);
  }

  setError(error: string): void {
    this._error$.next(error);
  }

  clearError(): void {
    this._error$.next(null);
  }

  reset(): void {
    this._productLine$.next(null);
    this._loading$.next(false);
    this._error$.next(null);
  }

  ngOnDestroy(): void {
    // ✅ REQUIRED - Complete all subjects
    this._productLine$.complete();
    this._loading$.complete();
    this._error$.complete();
  }
}
```

## Service with Async Actions

```ts
@Injectable({ providedIn: "root" })
export class DataStateService implements OnDestroy {
  private destroyRef = inject(DestroyRef);
  private httpService = inject(DataHttpService);

  private readonly _data$ = new BehaviorSubject<Data[]>([]);
  private readonly _selectedId$ = new BehaviorSubject<string | null>(null);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);

  readonly data$ = this._data$.asObservable();
  readonly selectedId$ = this._selectedId$.asObservable();
  readonly loading$ = this._loading$.asObservable();

  // Computed observable: selected item
  readonly selectedItem$ = combineLatest([this.data$, this.selectedId$]).pipe(map(([data, id]) => data.find((item) => item.id === id) ?? null));

  loadData(): void {
    this._loading$.next(true);

    this.httpService
      .getData()
      .pipe(
        finalize(() => this._loading$.next(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data) => this._data$.next(data),
        error: (err) => console.error("Load error:", err),
      });
  }

  selectItem(id: string): void {
    this._selectedId$.next(id);
  }

  addItem(item: Data): void {
    const current = this._data$.getValue();
    this._data$.next([...current, item]);
  }

  updateItem(id: string, updates: Partial<Data>): void {
    const current = this._data$.getValue();
    this._data$.next(current.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }

  removeItem(id: string): void {
    const current = this._data$.getValue();
    this._data$.next(current.filter((item) => item.id !== id));
  }

  ngOnDestroy(): void {
    this._data$.complete();
    this._selectedId$.complete();
    this._loading$.complete();
  }
}
```

## Usage in Components

### With async pipe (Recommended)

```ts
@Component({
  selector: "app-product-list",
  template: `
    <div *ngIf="loading$ | async; else content">
      <mat-spinner></mat-spinner>
    </div>

    <ng-template #content>
      <div *ngIf="error$ | async as error" class="error">
        {{ error }}
      </div>

      <div *ngIf="productLine$ | async as productLine">
        <h2>{{ productLine.name }}</h2>
        <p>{{ productLine.description }}</p>
      </div>
    </ng-template>
  `,
})
export class ProductListComponent {
  // ✅ Exposed directly for async pipe (no manual subscription)
  productLine$ = this.stateService.productLine$;
  loading$ = this.stateService.loading$;
  error$ = this.stateService.error$;

  constructor(private stateService: ProductLineStateService) {}

  refresh(): void {
    this.stateService.loadData();
  }
}
```

### With subscription (if needed)

```ts
@Component({...})
export class ProductDetailComponent {
  private destroyRef = inject(DestroyRef);
  private stateService = inject(ProductLineStateService);

  productLine: ProductLine | null = null;

  ngOnInit(): void {
    // ✅ With takeUntilDestroyed for cleanup
    this.stateService.productLine$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(productLine => {
        this.productLine = productLine;
        this.cdr.markForCheck();
      });
  }
}
```

## ReplaySubject: Replay the Last N Values

```ts
@Injectable({ providedIn: "root" })
export class NotificationService implements OnDestroy {
  // ReplaySubject keeps the last 5 notifications
  private readonly _notifications$ = new ReplaySubject<Notification>(5);
  readonly notifications$ = this._notifications$.asObservable();

  notify(message: string, type: "info" | "success" | "error"): void {
    this._notifications$.next({ message, type, timestamp: Date.now() });
  }

  ngOnDestroy(): void {
    this._notifications$.complete();
  }
}
```

## AsyncSubject: Final Value Only

```ts
@Injectable({ providedIn: "root" })
export class ConfigLoaderService implements OnDestroy {
  // AsyncSubject emits only the last value when complete() is called
  private readonly _config$ = new AsyncSubject<Config>();
  readonly config$ = this._config$.asObservable();

  loadConfig(): void {
    this.http.get<Config>("/api/config").subscribe({
      next: (config) => {
        this._config$.next(config);
        this._config$.complete(); // Emits the value now
      },
      error: (err) => this._config$.error(err),
    });
  }

  ngOnDestroy(): void {
    if (!this._config$.closed) {
      this._config$.complete();
    }
  }
}
```

## Facade Pattern: Combine Multiple Sources

```ts
@Injectable({ providedIn: "root" })
export class DashboardFacadeService {
  private userService = inject(UserService);
  private statisticsService = inject(StatisticsService);
  private notificationService = inject(NotificationService);

  // ✅ Combine multiple sources into one state
  readonly dashboardState$ = combineLatest({
    user: this.userService.currentUser$,
    stats: this.statisticsService.stats$,
    notifications: this.notificationService.recent$,
  }).pipe(
    map(({ user, stats, notifications }) => ({
      userName: user.name,
      totalItems: stats.total,
      unreadCount: notifications.filter((n) => !n.read).length,
      recentNotifications: notifications.slice(0, 5),
    })),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}

// Usage in component
@Component({
  template: `
    <div *ngIf="dashboard$ | async as dashboard">
      <h1>Hello {{ dashboard.userName }}</h1>
      <p>Total: {{ dashboard.totalItems }}</p>
      <p>Unread: {{ dashboard.unreadCount }}</p>
    </div>
  `,
})
export class DashboardComponent {
  dashboard$ = this.facade.dashboardState$;

  constructor(private facade: DashboardFacadeService) {}
}
```

## Computed Values with distinctUntilChanged

```ts
@Injectable({ providedIn: "root" })
export class CartService implements OnDestroy {
  private readonly _items$ = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this._items$.asObservable();

  // ✅ Computed values with distinctUntilChanged
  readonly totalPrice$ = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
    distinctUntilChanged() // Emits only when the total changes
  );

  readonly itemCount$ = this.items$.pipe(
    map((items) => items.reduce((sum, item) => sum + item.quantity, 0)),
    distinctUntilChanged()
  );

  readonly isEmpty$ = this.items$.pipe(
    map((items) => items.length === 0),
    distinctUntilChanged()
  );

  addItem(item: CartItem): void {
    const current = this._items$.getValue();
    const existing = current.find((i) => i.id === item.id);

    if (existing) {
      this.updateQuantity(item.id, existing.quantity + item.quantity);
    } else {
      this._items$.next([...current, item]);
    }
  }

  updateQuantity(id: string, quantity: number): void {
    const current = this._items$.getValue();
    this._items$.next(current.map((item) => (item.id === id ? { ...item, quantity } : item)));
  }

  clear(): void {
    this._items$.next([]);
  }

  ngOnDestroy(): void {
    this._items$.complete();
  }
}
```

## Store with Actions (Redux-like without NgRx)

```ts
interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: "root" })
export class SimpleStoreService implements OnDestroy {
  private readonly _state$ = new BehaviorSubject<AppState>({
    user: null,
    loading: false,
    error: null,
  });

  // Selectors
  readonly state$ = this._state$.asObservable();
  readonly user$ = this.state$.pipe(
    map((state) => state.user),
    distinctUntilChanged()
  );
  readonly loading$ = this.state$.pipe(
    map((state) => state.loading),
    distinctUntilChanged()
  );
  readonly error$ = this.state$.pipe(
    map((state) => state.error),
    distinctUntilChanged()
  );

  // Private helpers
  private setState(updates: Partial<AppState>): void {
    const current = this._state$.getValue();
    this._state$.next({ ...current, ...updates });
  }

  // Actions
  setUser(user: User): void {
    this.setState({ user, error: null });
  }

  setLoading(loading: boolean): void {
    this.setState({ loading });
  }

  setError(error: string): void {
    this.setState({ error, loading: false });
  }

  clearError(): void {
    this.setState({ error: null });
  }

  reset(): void {
    this._state$.next({ user: null, loading: false, error: null });
  }

  ngOnDestroy(): void {
    this._state$.complete();
  }
}
```

## Best Practices

1. **Private BehaviorSubject**, public Observable
2. **Always complete Subjects** in ngOnDestroy
3. **asObservable()** to prevent outside access to .next()
4. **Immutability**: create new objects/arrays when updating
5. **distinctUntilChanged()** to avoid redundant emissions
6. **shareReplay()** for expensive computed values
7. **Prefer async pipe** over manual subscriptions
8. **combineLatest** to compose multiple sources

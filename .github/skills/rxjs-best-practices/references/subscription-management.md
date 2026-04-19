# Subscription Management - Detailed Examples

## Subscription Lifecycle Management

### Main Pattern: takeUntilDestroyed

```ts
import { DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // ✅ For infinite streams (events, subjects, intervals)
    this.longLivingObservable$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => this.handle(value));
  }
}
```

## One-Shot Observables

### take(1) vs first()

```ts
import { take, first } from "rxjs";

// ✅ Use take(1) when the value is OPTIONAL
dialogRef
  .afterClosed()
  .pipe(take(1))
  .subscribe((result) => {
    if (result) this.handleConfirmation();
  });

// ✅ Use first() when you EXPECT a value (throws if no emission)
this.store
  .select(selectUser)
  .pipe(first())
  .subscribe((user) => (this.user = user));
```

### Full Example: Dialog with Confirmation

```ts
@Component({...})
export class ConfirmationComponent {
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  openDeleteDialog(itemId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete this item?' }
    });

    dialogRef.afterClosed()
      .pipe(take(1)) // Dialog closes only once
      .subscribe(confirmed => {
        if (confirmed) {
          this.deleteItem(itemId);
        }
      });
  }

  private deleteItem(id: string): void {
    this.service.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notificationService.showSuccess('Item deleted');
      });
  }
}
```

## Manual Subscription with Cleanup

```ts
@Component({...})
export class ManualSubscriptionComponent implements OnDestroy {
  private subscription = new Subscription();

  ngOnInit(): void {
    // ✅ Add all subscriptions to the Subscription container
    this.subscription.add(
      this.dataService.getData().subscribe(data => this.data = data)
    );

    this.subscription.add(
      this.eventService.events$.subscribe(event => this.handleEvent(event))
    );
  }

  ngOnDestroy(): void {
    // ✅ Unsubscribe all subscriptions at once
    this.subscription.unsubscribe();
  }
}
```

## Pattern with Subject for Cleanup

```ts
@Component({...})
export class SubjectCleanupComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);

    this.eventService.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => this.handleEvent(event));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Avoiding Memory Leaks

### ❌ Anti-Pattern: Subscription without Cleanup

```ts
// ❌ FORBIDDEN - Guaranteed memory leak
@Component({...})
export class LeakyComponent {
  ngOnInit() {
    // This subscription will NEVER be cleaned up
    this.service.getData().subscribe(data => this.data = data);

    // Multiple subscriptions = multiple leaks
    this.eventService.events$.subscribe(event => this.handleEvent(event));
    this.userService.currentUser$.subscribe(user => this.user = user);
  }
}
```

### ✅ Solution: Always use takeUntilDestroyed

```ts
// ✅ CORRECT - Automatic cleanup
@Component({...})
export class CleanComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.data = data);

    this.eventService.events$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => this.handleEvent(event));

    this.userService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => this.user = user);
  }
}
```

## Special Case: Subscription in Constructor

```ts
@Component({...})
export class ConstructorSubscriptionComponent {
  private destroyRef = inject(DestroyRef);

  constructor() {
    // ✅ takeUntilDestroyed also works in the constructor
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.data = data);
  }
}
```

## Subjects: Always Complete

### ❌ Anti-Pattern: Subject never completed

```ts
// ❌ FORBIDDEN - Subject is never completed
@Injectable({ providedIn: "root" })
export class LeakyService {
  private mySubject = new Subject<string>();
  readonly data$ = this.mySubject.asObservable();

  // No ngOnDestroy to complete the subject!
}
```

### ✅ Solution: Always complete Subjects

```ts
// ✅ CORRECT - Subject completed in ngOnDestroy
@Injectable({ providedIn: "root" })
export class CleanService implements OnDestroy {
  private mySubject = new Subject<string>();
  readonly data$ = this.mySubject.asObservable();

  ngOnDestroy(): void {
    this.mySubject.complete(); // ⚠️ REQUIRED
  }
}
```

## Combining Multiple Sources

```ts
@Component({...})
export class CombinedSourcesComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // ✅ combineLatest with takeUntilDestroyed
    combineLatest([
      this.userService.currentUser$,
      this.settingsService.settings$,
      this.permissionsService.permissions$
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([user, settings, permissions]) => {
        this.initializeWithData(user, settings, permissions);
      });
  }
}
```

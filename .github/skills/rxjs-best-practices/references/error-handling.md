# Error Handling with RxJS

## catchError: Handling in the Pipeline

### Basic Pattern

```ts
import { EMPTY, catchError, throwError, of } from 'rxjs';

@Component({...})
export class ErrorHandlingComponent {
  private destroyRef = inject(DestroyRef);
  private notificationService = inject(NotificationService);

  saveData(payload: Data): void {
    this.service.save(payload)
      .pipe(
        catchError(err => {
          this.notificationService.showError('Save failed', err?.code);
          return EMPTY; // Silently stop the stream
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.notificationService.showSuccess('Save successful');
      });
  }
}
```

## Error Handling Strategies

### 1. EMPTY: Silently stop the stream

```ts
this.service
  .getData()
  .pipe(
    catchError((err) => {
      console.error("Error while loading:", err);
      this.showErrorMessage(err);
      return EMPTY; // Complete the stream without a value
    }),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((data) => (this.data = data)); // Will not be called on error
```

### 2. of(): Provide a default value

```ts
this.userService
  .getUserPreferences()
  .pipe(
    catchError((err) => {
      console.error("Unable to load preferences:", err);
      return of(this.getDefaultPreferences()); // Returns default preferences
    }),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((preferences) => this.applyPreferences(preferences));
```

### 3. throwError: Propagate the error to the subscriber

```ts
this.service
  .criticalOperation()
  .pipe(
    catchError((err) => {
      console.error("Critical error:", err);
      this.logError(err);
      return throwError(() => new Error(`Critical operation failed: ${err.message}`));
    }),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe({
    next: (result) => this.handleSuccess(result),
    error: (err) => this.handleCriticalError(err), // Will be called
  });
```

## Retry with Backoff

### retry: Retry automatically

```ts
import { retry, timer } from 'rxjs';

@Component({...})
export class RetryComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.service.getData()
      .pipe(
        retry({
          count: 3,
          delay: 1000 // Wait 1s between attempts
        }),
        catchError(err => {
          this.showError('Failed after 3 attempts');
          return of([]); // Default value
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

### retryWhen: Retry with custom logic

```ts
import { retryWhen, delayWhen, tap, take } from 'rxjs';

@Component({...})
export class RetryWithBackoffComponent {
  private destroyRef = inject(DestroyRef);

  loadDataWithBackoff(): void {
    this.service.getData()
      .pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(err => console.log('Error, retrying...', err)),
            delayWhen((err, index) => timer(Math.pow(2, index) * 1000)), // Exponential backoff
            take(3) // Max 3 attempts
          )
        ),
        catchError(err => {
          this.showError('All retry attempts failed');
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

## Type-Based Error Handling

```ts
import { HttpErrorResponse } from '@angular/common/http';

@Component({...})
export class TypedErrorHandlingComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.service.getData()
      .pipe(
        catchError((err: HttpErrorResponse) => {
          switch (err.status) {
            case 401:
              this.router.navigate(['/login']);
              return EMPTY;
            case 403:
              this.showError('Access denied');
              return of([]);
            case 404:
              this.showError('Resource not found');
              return of([]);
            case 500:
              this.showError('Server error');
              return throwError(() => err);
            default:
              this.showError('An error occurred');
              return EMPTY;
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

## Errors in Complex Pipelines

### catchError at Different Levels

```ts
@Component({...})
export class MultilevelErrorHandlingComponent {
  private destroyRef = inject(DestroyRef);

  loadComplexData(id: string): void {
    this.service.getMainData(id)
      .pipe(
        // Error at the main level
        catchError(err => {
          this.showError('Unable to load main data');
          return throwError(() => err);
        }),
        switchMap(mainData =>
          this.service.getDetails(mainData.id).pipe(
            // Error at details level - provide default value
            catchError(err => {
              console.warn('Details unavailable:', err);
              return of({ details: 'Unavailable' });
            }),
            map(details => ({ mainData, details }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: ({ mainData, details }) => {
          this.mainData = mainData;
          this.details = details;
        },
        error: err => {
          this.handleFatalError(err);
        }
      });
  }
}
```

## finalize: Run code after success OR error

```ts
@Component({...})
export class FinalizeComponent {
  private destroyRef = inject(DestroyRef);
  loading = false;

  loadData(): void {
    this.loading = true;

    this.service.getData()
      .pipe(
        catchError(err => {
          this.showError(err.message);
          return of([]);
        }),
        finalize(() => {
          this.loading = false; // Executed in all cases
          this.cdr.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

## Complete Pattern: Loading + Error + Success

```ts
@Component({...})
export class CompletePatternComponent {
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  data: Data[] = [];
  loading = false;
  error: string | null = null;

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.dataService.getData()
      .pipe(
        catchError(err => {
          this.error = err.message || 'An error occurred';
          return of([]);
        }),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: data => {
          this.data = data;
          this.cdr.markForCheck();
        }
      });
  }
}
```

## tapResponse: Helper to handle next/error

```ts
import { tapResponse } from '@ngrx/operators';

@Component({...})
export class TapResponseComponent {
  private destroyRef = inject(DestroyRef);

  saveData(payload: Data): void {
    this.service.save(payload)
      .pipe(
        tapResponse(
          result => {
            this.showSuccess('Save succeeded');
            this.onSaveSuccess(result);
          },
          err => {
            this.showError('Error while saving');
            console.error(err);
          }
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(); // No handlers needed here
  }
}
```

## Errors in Loops (forkJoin)

```ts
@Component({...})
export class ParallelErrorHandlingComponent {
  private destroyRef = inject(DestroyRef);

  loadMultipleItems(ids: string[]): void {
    // If ONE request fails, forkJoin fails completely
    // Solution: per-request catchError
    const requests = ids.map(id =>
      this.service.getById(id).pipe(
        catchError(err => {
          console.warn(`Unable to load item ${id}:`, err);
          return of(null); // Return null for failed items
        })
      )
    );

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(results => {
        this.items = results.filter(item => item !== null); // Filter out failures
      });
  }
}
```

## Best Practices

1. **Always use catchError** in HTTP pipelines
2. **catchError before takeUntilDestroyed** in the pipe
3. **Use finalize for cleanup** (loading = false, etc.)
4. **Use tapResponse** for simplicity with @ngrx/operators
5. **Use per-request catchError** in forkJoin to avoid total failure
6. **Use of() for defaults**, EMPTY to stop, throwError to propagate

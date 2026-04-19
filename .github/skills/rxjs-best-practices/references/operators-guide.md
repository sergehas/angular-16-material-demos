# RxJS Operators Guide

## switchMap vs mergeMap vs exhaustMap

### switchMap: Cancel previous, use latest

**Use case:** Search, navigation, autocomplete

```ts
// ✅ switchMap cancels the previous request when a new value arrives
@Component({...})
export class SearchComponent {
  private destroyRef = inject(DestroyRef);
  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.searchService.search(term)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(results => this.results = results);
  }
}
```

**Navigation example:**

```ts
@Component({...})
export class ProductDetailComponent {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // switchMap cancels previous loading if the user navigates quickly
    this.route.params
      .pipe(
        switchMap(params => this.productService.getById(params['id'])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(product => this.product = product);
  }
}
```

### mergeMap: Run everything in parallel

**Use case:** Multiple data loading, parallel processing

```ts
// ✅ mergeMap runs all requests in parallel
@Component({...})
export class ItemListComponent {
  private destroyRef = inject(DestroyRef);

  loadItemsWithDetails(itemIds: string[]): void {
    from(itemIds)
      .pipe(
        mergeMap(id => this.service.getById(id), 3), // Max concurrency: 3
        toArray(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(items => this.items = items);
  }
}
```

**Data enrichment example:**

```ts
@Component({...})
export class EnrichedDataComponent {
  private destroyRef = inject(DestroyRef);

  loadEnrichedData(): void {
    this.baseService.getItems()
      .pipe(
        switchMap(items => from(items).pipe(
          mergeMap(item =>
            this.detailService.getDetail(item.id).pipe(
              map(detail => ({ ...item, detail }))
            ),
            5 // Max 5 simultaneous requests
          ),
          toArray()
        )),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(enrichedItems => this.items = enrichedItems);
  }
}
```

### exhaustMap: Ignore new emissions while running

**Use case:** Form submission, non-repeatable user actions

```ts
// ✅ exhaustMap ignores clicks while saving
@Component({...})
export class FormComponent {
  private destroyRef = inject(DestroyRef);
  private submitAction$ = new Subject<void>();

  constructor() {
    this.submitAction$
      .pipe(
        exhaustMap(() => this.service.save(this.form.value)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: result => this.handleSuccess(result),
        error: err => this.handleError(err)
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitAction$.next();
    }
  }
}
```

**Refresh button example:**

```ts
@Component({
  template: `<button (click)="refresh()">Refresh</button>`,
})
export class RefreshComponent {
  private destroyRef = inject(DestroyRef);
  private refreshAction$ = new Subject<void>();

  constructor() {
    // Ignore multiple clicks while loading
    this.refreshAction$
      .pipe(
        exhaustMap(() => this.dataService.loadData()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((data) => (this.data = data));
  }

  refresh(): void {
    this.refreshAction$.next();
  }
}
```

## concatMap: Run sequentially

**Use case:** Operations that must run in order

```ts
@Component({...})
export class SequentialOperationsComponent {
  private destroyRef = inject(DestroyRef);

  processItemsInOrder(items: Item[]): void {
    from(items)
      .pipe(
        concatMap(item => this.service.process(item)), // One at a time, in order
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(
        result => this.handleResult(result),
        err => this.handleError(err),
        () => this.handleComplete()
      );
  }
}
```

## Avoid Callback Hell

### ❌ Anti-Pattern: Nested subscriptions

```ts
// ❌ FORBIDDEN - 3 levels = 3 potential memory leaks
@Component({...})
export class CallbackHellComponent {
  loadData(): void {
    this.activatedRoute.params.subscribe(params => {
      this.productLineService.getById(params.id).subscribe(productLine => {
        this.dictionaryService.getData(productLine.code).subscribe(data => {
          this.data = data; // 😱 Callback hell
        });
      });
    });
  }
}
```

### ✅ Solution: Pipeline with switchMap

```ts
// ✅ CORRECT - Clean and maintainable pipeline
@Component({...})
export class CleanPipelineComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(params => this.productLineService.getById(params['id'])),
        switchMap(productLine => this.dictionaryService.getData(productLine.code)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

### Complex Example: Cascading Load with Context

```ts
@Component({...})
export class CascadeLoadingComponent {
  private destroyRef = inject(DestroyRef);

  loadCompleteData(): void {
    this.route.params
      .pipe(
        switchMap(params =>
          // Load user
          this.userService.getById(params['userId']).pipe(
            // Keep user in context
            map(user => ({ user, params }))
          )
        ),
        switchMap(({ user, params }) =>
          // Load user preferences
          this.preferencesService.get(user.id).pipe(
            map(preferences => ({ user, preferences, params }))
          )
        ),
        switchMap(({ user, preferences, params }) =>
          // Load specific content
          this.contentService.get(params['contentId'], preferences).pipe(
            map(content => ({ user, preferences, content }))
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(({ user, preferences, content }) => {
        this.initializeComponent(user, preferences, content);
      });
  }
}
```

## Parallel Operations

### forkJoin: Wait for all requests to complete

```ts
// ✅ Wait until all requests are completed
@Component({...})
export class ParallelLoadingComponent {
  private destroyRef = inject(DestroyRef);

  loadAllData(id: string): void {
    forkJoin({
      productLine: this.productLineService.getById(id),
      responsibilities: this.responsibilityService.get(id),
      events: this.eventService.getAll(id),
      metadata: this.metadataService.get(id)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ productLine, responsibilities, events, metadata }) => {
        this.initialize(productLine, responsibilities, events, metadata);
      });
  }
}
```

**Array example:**

```ts
@Component({...})
export class BatchLoadingComponent {
  private destroyRef = inject(DestroyRef);

  enrichItems(items: Item[]): void {
    // Load details for each item in parallel
    forkJoin(items.map(item => this.service.getDetail(item.id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(details => {
        items.forEach((item, index) => {
          item.detail = details[index];
        });
        this.items = items;
      });
  }
}
```

### combineLatest: Latest values from multiple streams

```ts
@Component({...})
export class CombinedStreamsComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Updates whenever one source changes
    combineLatest([
      this.userService.currentUser$,
      this.settingsService.settings$,
      this.themeService.currentTheme$
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([user, settings, theme]) => {
        this.applyUserContext(user, settings, theme);
      });
  }
}
```

**Object example:**

```ts
@Component({...})
export class CombinedObjectComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    combineLatest({
      user: this.userService.currentUser$,
      permissions: this.permissionsService.permissions$,
      config: this.configService.config$
    })
      .pipe(
        map(({ user, permissions, config }) => ({
          canEdit: permissions.includes('EDIT'),
          canDelete: permissions.includes('DELETE') && user.role === 'ADMIN',
          maxItems: config.maxItemsPerPage
        })),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(context => this.context = context);
  }
}
```

## Visual Comparison

| Operator        | Behavior                | Use case                  |
| --------------- | ----------------------- | ------------------------- |
| `switchMap`     | Cancels previous        | Search, navigation        |
| `mergeMap`      | Runs all in parallel    | Multiple loading          |
| `exhaustMap`    | Ignores while running   | Form submission           |
| `concatMap`     | Sequential queue        | Ordered operations        |
| `forkJoin`      | Waits for all to finish | Batch HTTP requests       |
| `combineLatest` | Latest value from each  | Multiple reactive streams |

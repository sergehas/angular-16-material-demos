# Anti-Patterns RxJS - À Éviter Absolument

## 🚫 Subscription Sans Cleanup

### ❌ INTERDIT : Pas de takeUntilDestroyed

```ts
@Component({...})
export class LeakyComponent {
  ngOnInit() {
    // ❌ Fuite mémoire garantie
    this.service.getData().subscribe(data => this.data = data);

    // ❌ Chaque navigation vers ce component crée une nouvelle subscription
    this.userService.currentUser$.subscribe(user => this.user = user);
  }
}
```

### ✅ CORRECT : Toujours nettoyer

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

## 🚫 Constructor Subscription Sans Cleanup

### ❌ INTERDIT

```ts
@Component({...})
export class BadConstructorComponent {
  constructor(private service: DataService) {
    // ❌ Subscription jamais nettoyée
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
    // ✅ Cleanup automatique
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 Subscribe dans une Boucle

### ❌ INTERDIT : Crée N subscriptions non trackées

```ts
@Component({...})
export class LoopSubscribeComponent {
  loadItems(items: Item[]): void {
    // ❌ Crée une subscription pour chaque item, aucune n'est nettoyée
    items.forEach(item => {
      this.service.getDetail(item.id).subscribe(detail => {
        item.detail = detail;
      });
    });
  }
}
```

### ✅ CORRECT : forkJoin ou mergeMap

```ts
@Component({...})
export class CorrectBatchComponent {
  private destroyRef = inject(DestroyRef);

  loadItems(items: Item[]): void {
    // ✅ Une seule subscription, cleanup automatique
    forkJoin(items.map(item => this.service.getDetail(item.id)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(details => {
        items.forEach((item, index) => item.detail = details[index]);
      });
  }
}
```

## 🚫 Double Subscription (async pipe + subscribe)

### ❌ INTERDIT : Subscription doublée

```ts
@Component({
  template: `
    <!-- ❌ Première subscription via async pipe -->
    <div *ngIf="data$ | async as data">{{ data.length }} items</div>
  `,
})
export class DoubleSubscriptionComponent {
  data$ = this.service.getData();

  ngOnInit() {
    // ❌ Deuxième subscription sur le même stream !
    this.data$.subscribe((data) => console.log("Data loaded:", data));
  }
}
```

### ✅ CORRECT : Une seule méthode

```ts
@Component({
  template: `
    <!-- ✅ Une seule subscription via async pipe -->
    <div *ngIf="data$ | async as data">{{ data.length }} items</div>
  `,
})
export class SingleSubscriptionComponent {
  private destroyRef = inject(DestroyRef);

  // ✅ shareReplay pour partager la subscription si nécessaire
  data$ = this.service.getData().pipe(
    tap((data) => console.log("Data loaded:", data)),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
```

## 🚫 Subject Sans complete()

### ❌ INTERDIT : Subject jamais complété

```ts
@Injectable({ providedIn: "root" })
export class LeakySubjectService {
  private mySubject = new Subject<string>();
  data$ = this.mySubject.asObservable();

  // ❌ Pas de ngOnDestroy, le subject n'est jamais complété
  emit(value: string): void {
    this.mySubject.next(value);
  }
}
```

### ✅ CORRECT : Toujours compléter

```ts
@Injectable({ providedIn: "root" })
export class CleanSubjectService implements OnDestroy {
  private mySubject = new Subject<string>();
  data$ = this.mySubject.asObservable();

  emit(value: string): void {
    this.mySubject.next(value);
  }

  ngOnDestroy(): void {
    // ✅ OBLIGATOIRE
    this.mySubject.complete();
  }
}
```

## 🚫 Nested Subscriptions (Callback Hell)

### ❌ INTERDIT : Subscriptions imbriquées

```ts
@Component({...})
export class CallbackHellComponent {
  loadData(): void {
    // ❌ 3 niveaux de subscriptions imbriquées
    this.route.params.subscribe(params => {
      this.service1.getData(params['id']).subscribe(data1 => {
        this.service2.getRelated(data1.code).subscribe(data2 => {
          this.data = data2; // 😱 Cauchemar de maintenance
        });
      });
    });
  }
}
```

### ✅ CORRECT : Pipeline avec operators

```ts
@Component({...})
export class CleanPipelineComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    // ✅ Pipeline propre et lisible
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

## 🚫 Subscribe dans Subscribe

### ❌ INTERDIT

```ts
@Component({...})
export class NestedComponent {
  saveData(): void {
    // ❌ Subscribe imbriqué
    this.userService.getCurrentUser().subscribe(user => {
      this.dataService.save(this.data, user.id).subscribe(result => {
        this.handleResult(result);
      });
    });
  }
}
```

### ✅ CORRECT : switchMap

```ts
@Component({...})
export class FlattenedComponent {
  private destroyRef = inject(DestroyRef);

  saveData(): void {
    // ✅ Pipeline aplati
    this.userService.getCurrentUser()
      .pipe(
        switchMap(user => this.dataService.save(this.data, user.id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => this.handleResult(result));
  }
}
```

## 🚫 Mutation de Données dans subscribe

### ❌ INTERDIT : Mutation directe

```ts
@Component({...})
export class MutatingComponent {
  items: Item[] = [];

  loadItems(): void {
    this.service.getItems()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(newItems => {
        // ❌ Mutation des données existantes
        newItems.forEach(item => {
          item.loaded = true;
          this.items.push(item);
        });
      });
  }
}
```

### ✅ CORRECT : Immutabilité

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
        // ✅ Création d'un nouveau tableau
        this.items = [...this.items, ...newItems];
      });
  }
}
```

## 🚫 BehaviorSubject Public

### ❌ INTERDIT : Subject exposé directement

```ts
@Injectable({ providedIn: "root" })
export class BadStateService {
  // ❌ N'importe qui peut appeler .next() de l'extérieur
  data$ = new BehaviorSubject<Data[]>([]);
}

// Usage :
// service.data$.next([]) // 💀 N'importe où dans l'app !
```

### ✅ CORRECT : Subject privé, Observable public

```ts
@Injectable({ providedIn: "root" })
export class GoodStateService implements OnDestroy {
  // ✅ Privé
  private readonly _data$ = new BehaviorSubject<Data[]>([]);

  // ✅ Public en lecture seule
  readonly data$ = this._data$.asObservable();

  setData(data: Data[]): void {
    this._data$.next(data);
  }

  ngOnDestroy(): void {
    this._data$.complete();
  }
}
```

## 🚫 subscribe() sans Gestion d'Erreur

### ❌ INTERDIT : Pas de catchError

```ts
@Component({...})
export class NoErrorHandlingComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    // ❌ Si erreur HTTP, le stream meurt et le loading reste à true
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

### ✅ CORRECT : Toujours gérer les erreurs

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

## 🚫 Ordre Incorrect des Operators

### ❌ INTERDIT : takeUntilDestroyed après finalize

```ts
@Component({...})
export class WrongOrderComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.loading = true;

    this.service.getData()
      .pipe(
        finalize(() => this.loading = false),
        takeUntilDestroyed(this.destroyRef) // ❌ Trop tard !
      )
      .subscribe(data => this.data = data);
  }
}
```

### ✅ CORRECT : Ordre logique

```ts
@Component({...})
export class CorrectOrderComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.loading = true;

    this.service.getData()
      .pipe(
        catchError(err => of([])),      // 1. Gestion d'erreur
        finalize(() => this.loading = false), // 2. Cleanup
        takeUntilDestroyed(this.destroyRef)  // 3. Unsubscribe
      )
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 Logique Métier dans subscribe

### ❌ INTERDIT : Traitement dans subscribe

```ts
@Component({...})
export class LogicInSubscribeComponent {
  loadData(): void {
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        // ❌ Logique métier complexe dans subscribe
        const filtered = data.filter(item => item.active);
        const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
        const grouped = this.groupByCategory(sorted);
        this.data = grouped;
      });
  }
}
```

### ✅ CORRECT : Logique dans le pipeline

```ts
@Component({...})
export class LogicInPipelineComponent {
  private destroyRef = inject(DestroyRef);

  loadData(): void {
    this.service.getData()
      .pipe(
        // ✅ Toute la logique dans le pipeline
        map(data => data.filter(item => item.active)),
        map(data => data.sort((a, b) => a.name.localeCompare(b.name))),
        map(data => this.groupByCategory(data)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(data => this.data = data);
  }
}
```

## 🚫 subscribe() avec Side Effects

### ❌ INTERDIT : Side effects dans map

```ts
this.service
  .getData()
  .pipe(
    map((data) => {
      // ❌ Side effect dans map
      console.log("Data loaded:", data);
      this.showNotification("Success");
      return data;
    }),
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((data) => (this.data = data));
```

### ✅ CORRECT : Utiliser tap pour les side effects

```ts
this.service
  .getData()
  .pipe(
    // ✅ tap pour les side effects
    tap((data) => console.log("Data loaded:", data)),
    tap(() => this.showNotification("Success")),
    map((data) => data), // map uniquement pour les transformations
    takeUntilDestroyed(this.destroyRef)
  )
  .subscribe((data) => (this.data = data));
```

## Récapitulatif des Anti-Patterns

| Anti-Pattern              | Pourquoi c'est mal           | Solution                              |
| ------------------------- | ---------------------------- | ------------------------------------- |
| Subscription sans cleanup | Fuite mémoire                | `takeUntilDestroyed()`                |
| Subscribe dans boucle     | N subscriptions non trackées | `forkJoin` ou `mergeMap`              |
| Nested subscriptions      | Code illisible, fuites       | `switchMap`, `mergeMap`               |
| Subject public            | Pas d'encapsulation          | Subject privé + asObservable()        |
| Pas de catchError         | Stream meurt sur erreur      | Toujours `catchError`                 |
| Double subscription       | Requêtes dupliquées          | `shareReplay` ou async pipe seulement |
| Logic dans subscribe      | Difficile à tester           | Logic dans le pipe avec `map`         |
| Subject sans complete()   | Fuite mémoire                | `complete()` dans ngOnDestroy         |

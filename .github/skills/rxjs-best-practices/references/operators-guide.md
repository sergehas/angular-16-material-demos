# Guide des Opérateurs RxJS

## switchMap vs mergeMap vs exhaustMap

### switchMap : Annuler le précédent, utiliser le dernier

**Cas d'usage :** Recherche, navigation, autocomplete

```ts
// ✅ switchMap annule la requête précédente si une nouvelle valeur arrive
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

**Exemple avec Navigation :**

```ts
@Component({...})
export class ProductDetailComponent {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // switchMap annule le chargement précédent si l'utilisateur navigue rapidement
    this.route.params
      .pipe(
        switchMap(params => this.productService.getById(params['id'])),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(product => this.product = product);
  }
}
```

### mergeMap : Exécuter tout en parallèle

**Cas d'usage :** Chargement de données multiples, traitement parallèle

```ts
// ✅ mergeMap exécute toutes les requêtes en parallèle
@Component({...})
export class ItemListComponent {
  private destroyRef = inject(DestroyRef);

  loadItemsWithDetails(itemIds: string[]): void {
    from(itemIds)
      .pipe(
        mergeMap(id => this.service.getById(id), 3), // Concurrence max : 3
        toArray(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(items => this.items = items);
  }
}
```

**Exemple avec Enrichissement de Données :**

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
            5 // Max 5 requêtes simultanées
          ),
          toArray()
        )),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(enrichedItems => this.items = enrichedItems);
  }
}
```

### exhaustMap : Ignorer les nouvelles pendant l'exécution

**Cas d'usage :** Soumission de formulaires, actions utilisateur non répétables

```ts
// ✅ exhaustMap ignore les clics pendant la sauvegarde
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

**Exemple avec Bouton de Rafraîchissement :**

```ts
@Component({
  template: `<button (click)="refresh()">Rafraîchir</button>`,
})
export class RefreshComponent {
  private destroyRef = inject(DestroyRef);
  private refreshAction$ = new Subject<void>();

  constructor() {
    // Ignore les clics multiples pendant le chargement
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

## concatMap : Exécuter séquentiellement

**Cas d'usage :** Opérations devant être effectuées dans l'ordre

```ts
@Component({...})
export class SequentialOperationsComponent {
  private destroyRef = inject(DestroyRef);

  processItemsInOrder(items: Item[]): void {
    from(items)
      .pipe(
        concatMap(item => this.service.process(item)), // Une à la fois, dans l'ordre
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

## Éviter le Callback Hell

### ❌ Anti-Pattern : Subscriptions imbriquées

```ts
// ❌ INTERDIT - 3 niveaux = 3 fuites mémoire potentielles
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

### ✅ Solution : Pipeline avec switchMap

```ts
// ✅ CORRECT - Pipeline propre et maintenable
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

### Exemple Complexe : Chargement en Cascade avec Contexte

```ts
@Component({...})
export class CascadeLoadingComponent {
  private destroyRef = inject(DestroyRef);

  loadCompleteData(): void {
    this.route.params
      .pipe(
        switchMap(params =>
          // Charge l'utilisateur
          this.userService.getById(params['userId']).pipe(
            // Garde l'utilisateur en contexte
            map(user => ({ user, params }))
          )
        ),
        switchMap(({ user, params }) =>
          // Charge les préférences de l'utilisateur
          this.preferencesService.get(user.id).pipe(
            map(preferences => ({ user, preferences, params }))
          )
        ),
        switchMap(({ user, preferences, params }) =>
          // Charge le contenu spécifique
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

## Opérations Parallèles

### forkJoin : Attendre la complétion de toutes les requêtes

```ts
// ✅ Attendre que toutes les requêtes soient terminées
@Component({...})
export class ParallelLoadingComponent {
  private destroyRef = inject(DestroyRef);

  loadAllData(id: string): void {
    forkJoin({
      productLine: this.productLineService.getById(id),
      responsabilities: this.responsabilityService.get(id),
      events: this.eventService.getAll(id),
      metadata: this.metadataService.get(id)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ productLine, responsabilities, events, metadata }) => {
        this.initialize(productLine, responsabilities, events, metadata);
      });
  }
}
```

**Exemple avec Tableau :**

```ts
@Component({...})
export class BatchLoadingComponent {
  private destroyRef = inject(DestroyRef);

  enrichItems(items: Item[]): void {
    // Charge les détails pour chaque item en parallèle
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

### combineLatest : Valeurs les plus récentes de plusieurs streams

```ts
@Component({...})
export class CombinedStreamsComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Se met à jour à chaque changement de l'une des sources
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

**Exemple avec objet :**

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

## Comparaison Visuelle

| Opérateur       | Comportement                | Cas d'usage                |
| --------------- | --------------------------- | -------------------------- |
| `switchMap`     | Annule le précédent         | Recherche, navigation      |
| `mergeMap`      | Exécute tout en parallèle   | Chargement multiple        |
| `exhaustMap`    | Ignore pendant exécution    | Soumission formulaire      |
| `concatMap`     | File d'attente séquentielle | Opérations ordonnées       |
| `forkJoin`      | Attend la fin de tous       | Batch de requêtes HTTP     |
| `combineLatest` | Dernière valeur de chaque   | Streams multiples reactifs |

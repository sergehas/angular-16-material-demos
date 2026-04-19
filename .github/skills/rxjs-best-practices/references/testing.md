# Testing RxJS Code

## Mocking Observables in Tests

### Simple Service Mock

```ts
import { of, throwError } from "rxjs";

describe("DataComponent", () => {
  let component: DataComponent;
  let mockService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    // ✅ Create a service mock
    mockService = jasmine.createSpyObj("DataService", ["getData", "saveData"]);

    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: mockService }],
    });

    component = TestBed.createComponent(DataComponent).componentInstance;
  });

  it("should load data on init", () => {
    const mockData = [{ id: "1", name: "Test" }];
    mockService.getData.and.returnValue(of(mockData));

    component.ngOnInit();

    expect(mockService.getData).toHaveBeenCalled();
    expect(component.data).toEqual(mockData);
  });

  it("should handle errors", () => {
    const error = new Error("Network error");
    mockService.getData.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(component.error).toBeTruthy();
    expect(component.data).toEqual([]);
  });
});
```

## Testing with fakeAsync and tick

### Testing debounceTime

```ts
import { fakeAsync, tick } from "@angular/core/testing";

describe("SearchComponent", () => {
  let component: SearchComponent;
  let mockSearchService: jasmine.SpyObj<SearchService>;

  beforeEach(() => {
    mockSearchService = jasmine.createSpyObj("SearchService", ["search"]);

    TestBed.configureTestingModule({
      providers: [{ provide: SearchService, useValue: mockSearchService }],
    });

    component = TestBed.createComponent(SearchComponent).componentInstance;
  });

  it("should debounce search input", fakeAsync(() => {
    const searchSpy = spyOn(component, "performSearch");
    mockSearchService.search.and.returnValue(of([]));

    component.searchControl.setValue("test");
    tick(100); // Less than debounceTime(300)
    expect(searchSpy).not.toHaveBeenCalled();

    tick(200); // Total 300ms = debounceTime
    expect(searchSpy).toHaveBeenCalledWith("test");
  }));

  it("should cancel previous search", fakeAsync(() => {
    mockSearchService.search.and.returnValue(of([]));

    component.searchControl.setValue("first");
    tick(200);

    component.searchControl.setValue("second");
    tick(300);

    // Only the last search should be called
    expect(mockSearchService.search).toHaveBeenCalledTimes(1);
    expect(mockSearchService.search).toHaveBeenCalledWith("second");
  }));
});
```

## Testing with TestScheduler (Marbles)

### Configuration

```ts
import { TestScheduler } from "rxjs/testing";

describe("DataService", () => {
  let scheduler: TestScheduler;
  let service: DataService;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });

    service = TestBed.inject(DataService);
  });

  it("should transform data correctly", () => {
    scheduler.run(({ cold, expectObservable }) => {
      const input$ = cold("  -a-b-c|", {
        a: { value: 1 },
        b: { value: 2 },
        c: { value: 3 },
      });

      const expected = "     -x-y-z|";
      const expectedValues = {
        x: { transformed: 1 },
        y: { transformed: 2 },
        z: { transformed: 3 },
      };

      const result$ = service.transformData(input$);
      expectObservable(result$).toBe(expected, expectedValues);
    });
  });
});
```

### Testing with retry

```ts
it("should retry on error", () => {
  scheduler.run(({ cold, expectObservable }) => {
    const input$ = cold("  --#", null, new Error("Fail"));
    const expected = "     ----#"; // Retry once after 2 frames

    const result$ = input$.pipe(retry({ count: 1, delay: 2 }));
    expectObservable(result$).toBe(expected);
  });
});
```

## Testing Subjects

### BehaviorSubject

```ts
describe("StateService", () => {
  let service: StateService;

  beforeEach(() => {
    service = TestBed.inject(StateService);
  });

  it("should emit initial value", (done) => {
    service.data$.subscribe((data) => {
      expect(data).toEqual([]);
      done();
    });
  });

  it("should emit new values", (done) => {
    const testData = [{ id: "1", name: "Test" }];
    const emissions: any[] = [];

    service.data$.subscribe((data) => {
      emissions.push(data);

      if (emissions.length === 2) {
        expect(emissions[0]).toEqual([]);
        expect(emissions[1]).toEqual(testData);
        done();
      }
    });

    service.setData(testData);
  });

  it("should get current value synchronously", () => {
    const testData = [{ id: "1", name: "Test" }];
    service.setData(testData);

    expect(service.currentData).toEqual(testData);
  });
});
```

## HTTP Testing with HttpClientTestingModule

### HTTP Testing Configuration

```ts
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("DataHttpService", () => {
  let service: DataHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataHttpService],
    });

    service = TestBed.inject(DataHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no pending requests
  });

  it("should fetch data", () => {
    const mockData = [{ id: "1", name: "Test" }];

    service.getData().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne("/api/data");
    expect(req.request.method).toBe("GET");
    req.flush(mockData);
  });

  it("should handle HTTP errors", () => {
    const errorMessage = "Server error";

    service.getData().subscribe({
      next: () => fail("should have failed"),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne("/api/data");
    req.flush("Error", { status: 500, statusText: errorMessage });
  });

  it("should cancel request on unsubscribe", () => {
    const subscription = service.getData().subscribe();

    subscription.unsubscribe();

    const req = httpMock.expectOne("/api/data");
    expect(req.cancelled).toBeTruthy();
  });
});
```

## Testing switchMap

```ts
describe("ProductDetailComponent", () => {
  let component: ProductDetailComponent;
  let mockRoute: any;
  let mockService: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    mockRoute = {
      params: new BehaviorSubject({ id: "1" }),
    };

    mockService = jasmine.createSpyObj("ProductService", ["getById"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: ProductService, useValue: mockService },
      ],
    });

    component = TestBed.createComponent(ProductDetailComponent).componentInstance;
  });

  it("should load product when route params change", fakeAsync(() => {
    const product1 = { id: "1", name: "Product 1" };
    const product2 = { id: "2", name: "Product 2" };

    mockService.getById.and.returnValues(of(product1), of(product2));

    component.ngOnInit();
    tick();

    expect(component.product).toEqual(product1);
    expect(mockService.getById).toHaveBeenCalledWith("1");

    // Change route params
    mockRoute.params.next({ id: "2" });
    tick();

    expect(component.product).toEqual(product2);
    expect(mockService.getById).toHaveBeenCalledWith("2");
  }));
});
```

## forkJoin Test

```ts
describe("BatchLoadingService", () => {
  let service: BatchLoadingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(BatchLoadingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should load all items in parallel", fakeAsync(() => {
    const ids = ["1", "2", "3"];
    const results = [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
      { id: "3", name: "Item 3" },
    ];

    let loadedItems: any[] = [];

    service.loadItems(ids).subscribe((items) => {
      loadedItems = items;
    });

    // Verify that 3 requests were made
    const requests = ids.map((id) => httpMock.expectOne(`/api/items/${id}`));

    // Respond to all requests
    requests.forEach((req, index) => {
      req.flush(results[index]);
    });

    tick();

    expect(loadedItems).toEqual(results);
  }));
});
```

## Cleanup Test (Memory Leaks)

```ts
describe("Component cleanup", () => {
  let component: DataComponent;
  let mockService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj("DataService", ["getData"]);
    mockService.getData.and.returnValue(new Subject()); // Observable that never completes

    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: mockService }],
    });
  });

  it("should unsubscribe on destroy", () => {
    const fixture = TestBed.createComponent(DataComponent);
    component = fixture.componentInstance;

    const subscription = mockService.getData().subscribe();
    spyOn(subscription, "unsubscribe");

    component.ngOnInit();

    // Trigger destroy
    fixture.destroy();

    // The subscription should be unsubscribed
    expect(subscription.closed).toBeTruthy();
  });
});
```

## Error Handling Test

```ts
describe("ErrorHandlingComponent", () => {
  let component: ErrorHandlingComponent;
  let mockService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj("DataService", ["saveData"]);

    TestBed.configureTestingModule({
      providers: [{ provide: DataService, useValue: mockService }],
    });

    component = TestBed.createComponent(ErrorHandlingComponent).componentInstance;
  });

  it("should handle errors gracefully", () => {
    const error = new Error("Save failed");
    mockService.saveData.and.returnValue(throwError(() => error));

    spyOn(component, "showError");

    component.saveData({ test: "data" });

    expect(component.showError).toHaveBeenCalledWith("Save failed", undefined);
    expect(component.loading).toBeFalsy();
  });

  it("should use fallback value on error", (done) => {
    mockService.saveData.and.returnValue(throwError(() => new Error("Fail")));

    component.saveDataWithFallback({ test: "data" }).subscribe((result) => {
      expect(result).toEqual({ success: false });
      done();
    });
  });
});
```

## Best Practices for Tests

1. **Always use `httpMock.verify()`** in `afterEach()` for HttpClient
2. **fakeAsync + tick** to test timing behavior (debounce, delay, retry)
3. **TestScheduler (marbles)** for complex timing scenarios
4. **Mock services** with `jasmine.createSpyObj`
5. **Test cleanup**: verify that subscriptions are properly unsubscribed
6. **Test errors**: verify behavior in failure scenarios
7. **done()** for async tests that do not use fakeAsync

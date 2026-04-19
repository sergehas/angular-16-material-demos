---
name: testing
description: "Unit and E2E testing patterns for Angular. Covers TestBed setup, mocking, signal testing, fakeAsync, provideHttpClientTesting, and Playwright E2E. Use when asked to 'write test', 'add spec', 'unit test', or 'E2E'."
---

# Testing Skill

## Unit Tests — Karma / Jasmine

### TestBed Setup Pattern

```typescript
import { TestBed } from "@angular/core/testing";
import { provideHttpClientTesting, HttpTestingController } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent], // standalone component
    providers: [provideHttpClient(), provideHttpClientTesting(), { provide: MyService, useValue: mockMyService }],
  }).compileComponents();
});
```

### Mocking Services

```typescript
const mockMyService = jasmine.createSpyObj("MyService", ["getData"]);
mockMyService.getData.and.returnValue(of({ id: 1 }));

// Or use a stub:
const mockMyService = { getData: () => of({ id: 1 }) };
```

### Signal Testing

```typescript
it("should update signal on action", () => {
  const fixture = TestBed.createComponent(MyComponent);
  fixture.componentInstance.count.set(5);
  fixture.detectChanges();
  expect(fixture.componentInstance.doubled()).toBe(10);
});
```

### Async / fakeAsync

```typescript
import { fakeAsync, tick } from "@angular/core/testing";

it("should load data after delay", fakeAsync(() => {
  fixture.componentInstance.loadData();
  tick(500); // advance time
  fixture.detectChanges();
  expect(fixture.componentInstance.items().length).toBeGreaterThan(0);
}));
```

### HTTP Mocking

```typescript
it("should call the API", () => {
  const httpMock = TestBed.inject(HttpTestingController);
  service.getItems().subscribe((items) => expect(items.length).toBe(2));

  const req = httpMock.expectOne("/api/items");
  req.flush([{ id: 1 }, { id: 2 }]);
  httpMock.verify();
});
```

## Unit Test Checklist

- [ ] `.spec.ts` placed alongside the source file
- [ ] All public methods tested
- [ ] Edge cases covered (empty, null, error)
- [ ] HTTP calls mocked with `HttpTestingController`
- [ ] Observables tested with `done` or `fakeAsync`/`tick`
- [ ] No real HTTP calls, no real timers in tests
- [ ] Target ≥ 80% branch coverage

## E2E Tests — Playwright

See [`playwright-typescript.instructions.md`](../../instructions/playwright-typescript.instructions.md) for full E2E guidelines.

**Key points:**

- Files in `e2e/` directory, suffix `.spec.ts`
- Use role-based locators: `getByRole`, `getByLabel`, `getByText`
- Use `test.step()` to group interactions
- Use `toMatchAriaSnapshot` for structural assertions
- App must be running at `http://localhost:4200` before E2E tests

```bash
# Run E2E (app must be started first with npm start)
npx playwright test
npx playwright show-report
```

## Reference

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Docs](https://jasmine.github.io/)
- [Playwright Docs](https://playwright.dev/)

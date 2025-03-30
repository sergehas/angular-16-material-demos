import { TestBed } from "@angular/core/testing";
// Http testing module and mocking controller
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
// Other imports
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

import { ItemService } from "./item.service";

describe("ItemService", () => {
  let service: ItemService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ItemService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    service = TestBed.inject(ItemService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from "@angular/core/testing";
// Http testing module and mocking controller
import { provideHttpClientTesting } from "@angular/common/http/testing";
// Other imports
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

import { ItemService } from "./item.service";

describe("ItemService", () => {
  let service: ItemService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    httpClient = TestBed.inject(HttpClient);
  });

  it("should be created", () => {
    service = new ItemService(httpClient);
    expect(service).toBeTruthy();
  });
});

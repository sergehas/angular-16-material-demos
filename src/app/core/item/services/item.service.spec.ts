import { TestBed } from "@angular/core/testing";
// Http testing module and mocking controller
import { HttpClientTestingModule } from "@angular/common/http/testing";
// Other imports
import { HttpClient } from "@angular/common/http";

import { ItemService } from "./item.service";

describe("ItemService", () => {
  let service: ItemService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
  });

  it("should be created", () => {
    service = new ItemService(httpClient);
    expect(service).toBeTruthy();
  });
});

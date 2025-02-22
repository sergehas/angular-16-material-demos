import { TestBed } from "@angular/core/testing";

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { GroupsService } from "./groups.service";

describe("GroupsService", () => {
  let service: GroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(),]
    });
    service = TestBed.inject(GroupsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});

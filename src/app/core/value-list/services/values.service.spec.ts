import { HttpClient } from "@angular/common/http";
import { defer } from "rxjs";
//json import configured in tsconfig.spec.json
import mockData from "../../../../assets/mockup/values.json";
import { ValuesService } from "./values.service";

describe("ValuesService", () => {
  let service: ValuesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);

    service = new ValuesService(httpClientSpy);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should count", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service.count().subscribe((count) => {
      expect(count).toBe(21);
      done();
    });
    expect(httpClientSpy.get.calls.count()).withContext("one call").toBe(1);
  });
  it("should return 5 first records", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service
      .find(undefined, undefined, {
        pageNumber: 0,
        pageSize: 5,
      })
      .subscribe((values) => {
        expect(values.length).toBe(5);
        done();
      });
  });
});

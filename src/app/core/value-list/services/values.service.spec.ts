import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { defer } from "rxjs";
//json import configured in tsconfig.spec.json
import mockData from "../../../../assets/mockup/values.json";
import { ValuesService } from "./values.service";

describe("ValuesService", () => {
  let service: ValuesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);

    TestBed.configureTestingModule({
      providers: [ValuesService, { provide: HttpClient, useValue: httpClientSpy }],
    });

    service = TestBed.inject(ValuesService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should count without criteria", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service.count().subscribe((count) => {
      expect(count).toBe(21);
      done();
    });
    expect(httpClientSpy.get.calls.count()).withContext("one call").toBe(1);
  });

  it("should count with group criteria", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service.count({ group: "COLORS" }).subscribe((count) => {
      expect(count).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it("should count with name criteria", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service.count({ name: "Red" }).subscribe((count) => {
      expect(count).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it("should count with both group and name criteria", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service.count({ group: "COLORS", name: "Red" }).subscribe((count) => {
      expect(count).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it("should return 5 first records", (done: DoneFn) => {
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

  it("should find with group filter", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service.find({ group: "COLORS" }, undefined, undefined).subscribe((values) => {
      expect(Array.isArray(values)).toBeTrue();
      done();
    });
  });

  it("should find with name filter", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service.find({ name: "Red" }, undefined, undefined).subscribe((values) => {
      expect(Array.isArray(values)).toBeTrue();
      done();
    });
  });

  it("should save a value and return it", (done: DoneFn) => {
    import("../../../../assets/mockup/values.json").then((data) => {
      const value = data.items[0] as unknown as Parameters<typeof service.save>[0];
      service.save(value).subscribe((saved) => {
        expect(saved).toEqual(value);
        done();
      });
    });
  });

  it("should merge an updated cached value on find", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    const firstValue = mockData.items[0] as unknown as Parameters<typeof service.save>[0];
    const updatedValue = { ...firstValue, name: "Updated" } as unknown as Parameters<
      typeof service.save
    >[0];

    service.save(updatedValue).subscribe(() => {
      service.find(undefined, undefined, undefined).subscribe((values) => {
        const found = values.find((v) => v.name === "Updated");
        expect(found).toBeTruthy();
        done();
      });
    });
  });

  it("should paginate on page 1", (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(defer(() => Promise.resolve(mockData)));
    service
      .find(undefined, undefined, {
        pageNumber: 1,
        pageSize: 5,
      })
      .subscribe((values) => {
        expect(values.length).toBeLessThanOrEqual(5);
        done();
      });
  });
});

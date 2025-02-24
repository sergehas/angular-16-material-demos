import { TestBed } from "@angular/core/testing";
// Http testing module and mocking controller
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
// Other imports
import { HttpClient } from "@angular/common/http";
import { HttpService } from "./http-service";

class TestHttpService extends HttpService<any> {}

describe("Http-Service", () => {
  let service: HttpService<any>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("should be created", () => {
    service = new TestHttpService(httpClient, "");
    expect(service).toBeTruthy();
  });

  it("should get by id", () => {
    const id = "theId";
    const testData = { name: "Test Data" };
    service = new TestHttpService(httpClient, "");
    service.get(id).subscribe((data) => {
      // When observable resolves, result should match test data
      expect(data).toEqual(testData);
    });
    const req = httpTestingController.expectOne(`/${id}`);
    // Assert that the request is a GET.
    expect(req.request.method).toEqual("GET");

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(testData);

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it("should count", () => {
    const testData = { totalCount: 107, items: [] };
    service = new TestHttpService(httpClient, "");
    service.count().subscribe((data) => {
      expect(data).toEqual(107);
    });
    const req = httpTestingController.expectOne(`/count`);
    expect(req.request.method).toEqual("GET");
    req.flush(testData);
    httpTestingController.verify();
  });

  it("should find by criteria", () => {
    const testData = [{ d: 1 }, { d: 2 }, { d: 3 }];
    service = new TestHttpService(httpClient, "");
    service.find({ z: 47 }, undefined, undefined).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpTestingController.expectOne(
      "?q=%257B%2522z%2522%253A47%257D"
    );
    expect(req.request.method).toEqual("GET");
    req.flush({ items: testData });
    httpTestingController.verify();
  });
  it("should find with sort", () => {
    const testData = [{ d: 1 }, { d: 2 }, { d: 3 }];
    service = new TestHttpService(httpClient, "");
    service
      .find(undefined, { active: "d", direction: "asc" }, undefined)
      .subscribe((data) => {
        expect(data).toEqual(testData);
      });
    const req = httpTestingController.expectOne("?sort=d&order=asc");
    expect(req.request.method).toEqual("GET");
    req.flush({ items: testData });
    httpTestingController.verify();
  });
  it("should find with page", () => {
    const testData = [{ d: 1 }, { d: 2 }, { d: 3 }];
    service = new TestHttpService(httpClient, "");
    service
      .find(undefined, undefined, { pageNumber: 43, pageSize: 13 })
      .subscribe((data) => {
        expect(data).toEqual(testData);
      });
    const req = httpTestingController.expectOne("?pageSize=13&page=44");
    expect(req.request.method).toEqual("GET");
    req.flush({ items: testData });
    httpTestingController.verify();
  });

  it("should delete by Id", () => {
    const id = "abcd";
    const testData = "as is";
    service = new TestHttpService(httpClient, "");
    service.delete("abcd").subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpTestingController.expectOne(`/${id}`);
    expect(req.request.body).toBeNull();
    expect(req.request.method).toEqual("DELETE");
    req.flush(testData);
    httpTestingController.verify();
  });
  it("should delete by Id", () => {
    const id = "abcd";
    const testData = "as is";
    service = new TestHttpService(httpClient, "");
    service.delete("abcd").subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const req = httpTestingController.expectOne(`/${id}`);
    expect(req.request.body).toBeNull();
    expect(req.request.method).toEqual("DELETE");
    req.flush(testData);
    httpTestingController.verify();
  });

  it("should create", () => {
    const testData = { name: "a new one" };
    service = new TestHttpService(httpClient, "");
    service.create(testData).subscribe((data) => {
      expect(data).toEqual("as is");
    });
    const req = httpTestingController.expectOne("");
    expect(req.request.body).toEqual(testData);
    expect(req.request.method).toEqual("POST");
    req.flush("as is");
    httpTestingController.verify();
  });

  it("should update", () => {
    const id = "abcd";
    const testData = { id: id, name: "a new one" };
    service = new TestHttpService(httpClient, "");
    service.update(id, testData).subscribe((data) => {
      expect(data).toEqual("as is");
    });
    const req = httpTestingController.expectOne(`/${id}`);
    expect(req.request.body).toEqual(testData);
    expect(req.request.method).toEqual("PUT");
    req.flush("as is");
    httpTestingController.verify();
  });
});

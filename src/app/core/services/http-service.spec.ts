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
});

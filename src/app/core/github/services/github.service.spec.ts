import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { GithubService } from "./github.service";

describe("GithubService", () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should count issues without filter", (done) => {
    const mockResponse = { total_count: 42, items: [] };

    service.count().subscribe((count: number) => {
      expect(count).toBe(42);
      done();
    });

    const req = httpMock.expectOne(
      (r) => r.url === GithubService.href && r.params.get("q") === GithubService.repo
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should count issues with filter", (done) => {
    const mockResponse = { total_count: 10, items: [] };
    const filter = { query: "test query" };

    service.count(filter).subscribe((count: number) => {
      expect(count).toBe(10);
      done();
    });

    const req = httpMock.expectOne(
      (r) =>
        r.url === GithubService.href && r.params.get("q") === `${GithubService.repo} test query`
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should find issues without sort and page", (done) => {
    const mockResponse = {
      total_count: 2,
      items: [
        {
          number: "1",
          title: "Issue 1",
          state: "open",
          created_at: "2023-01-01",
          url: "url1",
          body: "body1",
          user: { login: "user1" },
        },
        {
          number: "2",
          title: "Issue 2",
          state: "closed",
          created_at: "2023-01-02",
          url: "url2",
          body: "body2",
          user: { login: "user2" },
        },
      ],
    };

    service.find(undefined, undefined, undefined).subscribe((issues) => {
      expect(issues.length).toBe(2);
      expect(issues[0].number).toBe("1");
      expect(issues[0].title).toBe("Issue 1");
      done();
    });

    const req = httpMock.expectOne(
      (r) => r.url === GithubService.href && r.params.get("q") === GithubService.repo
    );
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  it("should find issues with sort and page", (done) => {
    const mockResponse = {
      total_count: 1,
      items: [
        {
          number: "3",
          title: "Issue 3",
          state: "open",
          created_at: "2023-01-03",
          url: "url3",
          body: "body3",
          user: { login: "user3" },
        },
      ],
    };
    const filter = { query: "bug" };
    const sort = { active: "created", direction: "desc" as const };
    const page = { pageNumber: 0, pageSize: 10 };

    service.find(filter, sort, page).subscribe((issues) => {
      expect(issues.length).toBe(1);
      expect(issues[0].number).toBe("3");
      done();
    });

    const req = httpMock.expectOne((r) => {
      return (
        r.url === GithubService.href &&
        r.params.get("q") === `${GithubService.repo} bug` &&
        r.params.get("sort") === "created" &&
        r.params.get("order") === "desc" &&
        r.params.get("per_page") === "10" &&
        r.params.get("page") === "1"
      );
    });
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });
});

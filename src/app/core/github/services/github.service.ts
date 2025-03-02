import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Observable, map } from "rxjs";
import { FilterValue, HttpService, Page } from "../../services/http-service";
import { Issue } from "../models/issue";

type Result = { total_count: number; items: Record<string, FilterValue>[] };

@Injectable({
  providedIn: "root",
})
export class GithubService extends HttpService<Issue> {
  static readonly href = "https://api.github.com/search/issues";
  static readonly repo = "repo:angular/components";

  constructor(http: HttpClient) {
    super(http, GithubService.href);
    this.headers = this.headers.set("accept", "application/vnd.github+json");
  }
  private _BuildQuery(params: HttpParams, filter?: { query: string }): HttpParams {
    if (filter?.query) {
      params = params.set("q", `${GithubService.repo} ${filter.query.replaceAll(/\s+/g, " ")}`);
    } else {
      params = params.set("q", GithubService.repo);
    }
    return params;
  }

  override count(filter?: { query: string }): Observable<number> {
    // const requestUrl = `${
    // 	GithubService.href
    // }?q=repo:angular/components&sort=${sort}&order=${order}&per_page=${pageSize}&page=${
    // 	pageNumber + 1
    // }`;
    //there is no dedicated API for count, only the search api is available ==> to count, trigger a search, with result page size=1
    let params = new HttpParams();
    params = this._BuildQuery(params, filter);
    return this.http
      .get<Result>(GithubService.href, {
        headers: this.headers,
        params: params.set("per_page", 1),
      })
      .pipe(map((res) => res.total_count));
  }
  /**
   *  github searcg API supports lack of page & sort, so those params are optional.
   * With some other services, where page & sort are mandatory, then an execption should be thrown if params are missing
   *
   */
  override find(
    filter: { query: string } | undefined,
    sort: Sort | undefined,
    page: Page | undefined
  ): Observable<Issue[]> {
    // URL is  `<base_url>?q=repo:angular/components&sort=${sort}&order=${order}&per_page=${pageSize}&page=${pageNumber + 1}`;

    let params = new HttpParams();
    params = this._BuildQuery(params, filter);
    if (sort) {
      params = params.set("sort", sort.active).set("order", sort!.direction);
    }
    if (page) {
      params = params.set("per_page", page.pageSize).set("page", page.pageNumber + 1);
    }

    return this.http
      .get<Result>(GithubService.href, {
        headers: this.headers,
        params: params,
      })
      .pipe(
        //transform results into expected models
        map((res) => {
          return res.items.map(
            (i: Record<string, FilterValue>) =>
              ({
                created: new Date(i["created_at"] as string),
                number: i["number"],
                state: i["state"],
                title: i["title"],
                url: i["url"],
                body: i["body"],
                userId: (i["user"] as unknown as { login: string })["login"],
              }) as Issue
          );
        })
      );
  }
}

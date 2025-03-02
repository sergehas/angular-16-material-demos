import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Observable, map } from "rxjs";

export type Page = {
  pageNumber: number;
  pageSize: number;
};

export type FilterValue = string | boolean | number | Date | (string | boolean | number | Date);
export type Filter = Record<string, FilterValue>;

/**
 * Abstract service for making HTTP requests with filtering, sorting, and pagination.
 */
@Injectable({
  providedIn: "root",
})
export abstract class HttpService<T> {
  protected headers: HttpHeaders = new HttpHeaders({
    accept: "application/json",
  });

  /**
   * Initializes the HTTP service with the provided HttpClient and base URL.
   * @param http The HttpClient to use for making requests.
   * @param baseUrl The base URL for the API.
   *
   * the default verbs & URLs are:
   *
   * * `count`: `GET` `${baseUrl}/count`
   *   * the optional parameter (search criteria) is passed as a query string : `q={criteria as json}`
   * * `find`: `GET`: `${baseUrl}`
   *   * the optional parameter (search criteria) is passed as a query string : `q={criteria as json}`
   *   * the optional parameter (page) is passed as a query string : `pageSize={pageSize}&page={pageNumber}`
   *   * the optional parameter (sort) is passed as a query string : `sort={field}&order={'asc' | 'desc' | ''}`
   * * `get`: `GET` `${baseUrl}/${id}`
   * * `create`: `POST` `${baseUrl}`
   * * `delete`: `DELETE` ${baseUrl}/${id}`
   * * `update`: `PUT` ${baseUrl}/${id}`
   *
   */
  constructor(
    readonly http: HttpClient,
    protected baseUrl: string
  ) {}

  /**
   * Encodes a filter object into a query string.
   * @param f The filter object to encode.
   * @returns The encoded filter as a query string.
   */
  protected encodeFilter(f: Filter | undefined): string {
    if (!f) return "";
    return encodeURIComponent(JSON.stringify(f));
  }

  /**
   * Counts the number of items matching the given criteria.
   * @param criteria The filter criteria.
   * @returns An Observable that emits the total count of matching items.
   */
  count(criteria?: Filter): Observable<number> {
    let params = new HttpParams();
    if (criteria) {
      params = params.set("q", this.encodeFilter(criteria));
    }
    return this.http
      .get<{ totalCount: number; items: T[] }>(`${this.baseUrl}/count`, {
        headers: this.headers,
        params: params,
      })
      .pipe(map((res) => res.totalCount));
  }

  /**
   * Finds items matching the given criteria, sorted and paginated.
   * @param criteria The filter criteria.
   * @param sort The sorting options.
   * @param page The pagination options.
   * @returns An Observable that emits an array of matching items.
   */
  find(
    criteria: Filter | undefined,
    sort: Sort | undefined,
    page: Page | undefined
  ): Observable<T[]> {
    let params = new HttpParams();
    if (sort) {
      params = params.set("sort", sort.active).set("order", sort.direction);
    }
    if (page) {
      params = params.set("pageSize", page.pageSize).set("page", page.pageNumber + 1);
    }
    if (criteria) {
      params = params.set("q", this.encodeFilter(criteria));
    }
    return this.http
      .get<{ total_count: number; items: T[] }>(this.baseUrl, {
        headers: this.headers,
        params: params,
      })
      .pipe(map((res) => res.items));
  }

  /**
   * Retrieves an item by its ID.
   * @param id The ID of the item to retrieve.
   * @returns An Observable that emits the retrieved item.
   */
  get(id: keyof T): Observable<T> {
    const u = `${this.baseUrl}/${encodeURIComponent(String(id))}`;
    return this.http
      .get<T>(u, {
        headers: this.headers,
      })
      .pipe(map((res) => res));
  }
  create(item: T): Observable<T> {
    return this.http.post<T>(this.baseUrl, item, {
      headers: this.headers,
    });
  }
  delete(id: keyof T): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${encodeURIComponent(String(id))}`, {
      headers: this.headers,
    });
  }

  update(id: keyof T, item: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${encodeURIComponent(String(id))}`, item, {
      headers: this.headers,
    });
  }
}

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Observable, map } from "rxjs";

export type Page = {
	pageNumber: number;
	pageSize: number;
};

export type Filter = Record<
	string,
	string | boolean | number | Date | (string | boolean | number | Date)
>;

@Injectable({
	providedIn: "root",
})
export abstract class HttpService<T> {
	protected headers: HttpHeaders = new HttpHeaders({
		accept: "application/json",
	});

	constructor(readonly http: HttpClient, protected baseUrl: string) { }

	protected encodeFilter(f: Filter | undefined): string {
		if (!f) return "";
		return encodeURIComponent(JSON.stringify(f));
	}
	count(criteria?: Filter): Observable<number> {
		let params = new HttpParams();
		if (criteria) {
			params = params.set("q", this.encodeFilter(criteria));
		}
		return this.http
			.get<{ totalCount: number; items: T[] }>(this.baseUrl, {
				headers: this.headers,
				params: params,
			})
			.pipe(map((res) => res.totalCount));
	}

	find(
		criteria: Filter | undefined,
		sort: Sort | undefined,
		page: Page | undefined
	): Observable<T[]> {
		let params = new HttpParams();
		if (sort) {
			params = params
				.set("sort", sort!.active)
				.set("order", sort!.direction);
		}
		if (page) {
			params = params
				.set("pageSize", page!.pageSize)
				.set("page", page!.pageNumber + 1);
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

	get(id: keyof T): Observable<T> {
		const u = this.baseUrl + `/${encodeURIComponent(String(id))}`
		return this.http
			.get<T>(u, {
				headers: this.headers,
			})
			.pipe(map((res) => res));
	}
}

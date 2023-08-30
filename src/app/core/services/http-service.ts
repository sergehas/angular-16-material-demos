import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { Observable, map } from "rxjs";

export type Page = {
	pageNumber: number;
	pageSize: number;
};

@Injectable({
	providedIn: "root",
})
export abstract class HttpService<T> {
	protected headers: HttpHeaders = new HttpHeaders({
		accept: "application/json",
	});

	constructor(readonly http: HttpClient, protected baseUrl: string) {}

	count(filter = ""): Observable<number> {
		return this.http
			.get<{ totalCount: number; items: T[] }>(this.baseUrl, {
				headers: this.headers,
				//TODO: handle filter
				//params: new HttpParams().set("filter", filter),
			})
			.pipe(map((res) => res.totalCount));
	}

	find(
		filter = "",
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
		//TODO: handle filter
		// if (filter) {
		// 	params = params
		// 		.set("filter", filter);
		// }
		return this.http
			.get<{ total_count: number; items: T[] }>(this.baseUrl, {
				headers: this.headers,
				params: params,
			})
			.pipe(map((res) => res.items));
	}
}

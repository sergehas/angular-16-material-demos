import { HttpClient, HttpParams } from "@angular/common/http";
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
	constructor(readonly http: HttpClient, protected baseUrl: string) {}

	count(filter = ""): Observable<number> {
		// const requestUrl = `${
		// 	GithubService.href
		// }?q=repo:angular/components&sort=${sort}&order=${order}&per_page=${pageSize}&page=${
		// 	pageNumber + 1
		// }`;
		//there is no dedicated API for count, only the search api is available ==> to count, trigger a search, with result page size=1
		return this.http
			.get<{ total_count: number; items: T[] }>(this.baseUrl, {
				headers: {
					accept: "application/json",
				},
				params: new HttpParams().set("per_page", 1),
			})
			.pipe(map((res) => res.total_count));
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
		return this.http
			.get<{ total_count: number; items: T[] }>(this.baseUrl, {
				headers: {
					accept: "application/json",
				},
				params: params,
			})
			.pipe(map((res) => res.items));
	}
}

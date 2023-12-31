import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { Issue } from "../models/issue";
import { HttpService, Page } from "../../services/http-service";
import { Sort } from "@angular/material/sort";

@Injectable({
	providedIn: "root",
})
export class GithubService extends HttpService<Issue> {
	static href = "https://api.github.com/search/issues";
	static repo = "repo:angular/components";
	constructor(http: HttpClient) {
		super(http, GithubService.href);
	}

	override count(filter = ""): Observable<number> {
		// const requestUrl = `${
		// 	GithubService.href
		// }?q=repo:angular/components&sort=${sort}&order=${order}&per_page=${pageSize}&page=${
		// 	pageNumber + 1
		// }`;
		//there is no dedicated API for count, only the search api is available ==> to count, trigger a search, with result page size=1
		return this.http
			.get<{ total_count: number; items: Issue[] }>(GithubService.href, {
				headers: {
					accept: "application/vnd.github+json",
				},
				params: new HttpParams()
					.set("q", GithubService.repo)
					.set("per_page", 1),
			})
			.pipe(map((res) => res.total_count));
	}
	/**
	 *  github searcg API supports lack of page & sort, so those params are optional.
	 * With some other services, where page & sort are mandatory, then an execption should be thrown if params are missing
	 *
	 */
	override find(
		filter = "",
		sort: Sort | undefined,
		page: Page | undefined
	): Observable<Issue[]> {
		// const requestUrl = `${
		// 	GithubService.href
		// }?q=repo:angular/components&sort=${sort}&order=${order}&per_page=${pageSize}&page=${
		// 	pageNumber + 1
		// }`;
		let params = new HttpParams().set("q", GithubService.repo);
		if (sort) {
			params = params
				.set("sort", sort!.active)
				.set("order", sort!.direction);
		}
		if (page) {
			params = params
				.set("per_page", page!.pageSize)
				.set("page", page!.pageNumber + 1);
		}

		return this.http
			.get<{ total_count: number; items: Issue[] }>(GithubService.href, {
				headers: {
					accept: "application/vnd.github+json",
				},
				params: params,
			})
			.pipe(
				//transform results into expected models
				map((res) => {
					return res.items.map(
						(i: any) =>
							({
								created: new Date(i.created_at),
								number: i.number,
								state: i.state,
								title: i.title,
								url: i.url,
								body: i.body,
								userId: i.user.login,
							} as Issue)
					);
				})
			);
	}
}

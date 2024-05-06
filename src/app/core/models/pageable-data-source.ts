import { DataSource } from "@angular/cdk/collections";
import { EventEmitter } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import {
	BehaviorSubject,
	Observable,
	Subscription,
	auditTime,
	combineLatest,
	from,
	merge,
	noop,
	of as observableOf,
	tap
} from "rxjs";
import { Filter, HttpService, Page } from "../services/http-service";

export class Paginator {
	pageIndex = 0;
	pageSize!: number;
	page = new EventEmitter<PageEvent>();
	initialized = new Observable<void>();
	length = 0;

	constructor(pageSize: number = 100) {
		this.pageSize = pageSize;
	}
	/** Emits an event notifying that a change of the paginator's properties has been triggered. */
	private _emitPageEvent(previousPageIndex: number) {
		this.page.emit({
			previousPageIndex,
			pageIndex: this.pageIndex,
			pageSize: this.pageSize,
			length: this.length,
		});
	}


	/** Whether there is a next page. */
	hasNextPage(): boolean {
		const maxPageIndex = this.getNumberOfPages() - 1;
		return this.pageIndex < maxPageIndex && this.pageSize != 0;
	}

	/** Calculate the number of pages */
	getNumberOfPages(): number {
		if (!this.pageSize) {
			return 0;
		}
		return Math.ceil(this.length / this.pageSize);
	}

	nextPage(): void {
		if (!this.hasNextPage()) {
			return;
		}
		const previousPageIndex = this.pageIndex;
		this.pageIndex = this.pageIndex + 1;
		this._emitPageEvent(previousPageIndex);
	}

}

export class DatasourceError extends Error {
	constructor(err: Error) {
		super(err.message, {
			cause: err
		})
	}
}

export class PageableDataSource<
	T,
	P extends MatPaginator | Paginator = MatPaginator
> extends DataSource<T> {
	protected modelsSubject = new BehaviorSubject<T[]>([]);
	protected loadingSubject = new BehaviorSubject<boolean | Error>(false);
	public loading$ = this.loadingSubject.asObservable();

	protected countSubject = new BehaviorSubject<number>(0);
	protected countingSubject = new BehaviorSubject<boolean | Error>(false);
	public counting$ = this.countingSubject.asObservable();
	public length$ = this.countSubject.asObservable();
	private _length = 0;

	get length(): number {
		return this._length;
	}


	/**
	 * Instance of the MatSort directive used by the table to control its sorting. Sort changes
	 * emitted by the MatSort will trigger an update to the table's rendered data.
	 */
	private _sort: MatSort | undefined;

	get sort(): MatSort | undefined {
		return this._sort;
	}

	set sort(sort: MatSort | undefined) {
		this._sort = sort;
		this.updateChangeSubscription();
	}

	/**
	 * Instance of the paginator component used by the table to control what page of the data is
	 * displayed. Page changes emitted by the paginator will trigger an update to the
	 * table's rendered data.
	 *
	 * Note that the data source uses the paginator's properties to calculate which page of data
	 * should be displayed. If the paginator receives its properties as template inputs,
	 * e.g. `[pageLength]=100` or `[pageIndex]=1`, then be sure that the paginator's view has been
	 * initialized before assigning it to this data source.
	 */
	private _paginator: P | undefined;

	get paginator(): P | undefined {
		return this._paginator;
	}

	set paginator(paginator: P | undefined) {
		this._paginator = paginator;
		this.updateChangeSubscription();
	}

	private _filter: Filter | undefined;
	set filter(filter: Filter) {
		this._filter = filter;
	}
	constructor(protected service: HttpService<T>) {
		super();
		this.updateChangeSubscription();
	}

	private updateChangeSubscription() {
		//an "init" oneshot event to force load if no pager/sort exist
		const initalChange = from(["init"]);
		const sortChange: Observable<Sort | null | void> = this.sort
			? (merge(
				this.sort.sortChange,
				this.sort.initialized
			) as Observable<Sort | void>)
			: observableOf(null);

		const pageChange: Observable<PageEvent | null | void> = this.paginator
			? (merge(
				this.paginator.page,
				this.paginator.initialized
			) as Observable<PageEvent | void>)
			: observableOf(null);

		// reset the paginator after sorting
		sortChange.subscribe(() => {
			console.debug("[datasource] sort event");
			if (this.paginator) {
				this.paginator.pageIndex = 0;
			}
		});
		pageChange.subscribe(() => {
			console.debug("[datasource] page event");
		});
		initalChange.subscribe((e) => {
			console.debug("[datasource] init event", e);
			if (this.paginator) {
				this.count();
			}
		});
		//reload page on any event
		const changes = combineLatest([initalChange, sortChange, pageChange]);
		// The purpose of this intermediate `filteredEventStream` subscrption is to break the flow of events, by filtering it in order to have only the latest event.
		// More specificaly when the paginator and/or the sort are set.
		// The `auditTime(0)` is important as it breaks this event flow.
		//finally, this subscriptios is responsible to avoit extra service calls
		this.filteredEventStream?.unsubscribe();
		this.filteredEventStream = changes
			.pipe(
				auditTime(0),
				tap((e) => {
					console.info("[datasource] merge event", e);
					this.loadPage();
				})
			)
			.subscribe();
	}

	filteredEventStream: Subscription | null = null;
	/**
	 * return an Observable derived from issueSubject to avoid to expose internal subject
	 */
	connect(): Observable<readonly T[]> {
		console.debug("[datasource] Connecting datasource");
		return this.modelsSubject.asObservable();
	}

	disconnect(): void {
		this.modelsSubject.complete();
		this.loadingSubject.complete();
		this.countSubject.complete();
		this.countingSubject.complete();
	}
	public loadPage() {
		console.info("[datasource] load page");
		this.load(
			this._filter,
			this._sort,
			this._paginator
				? {
					pageNumber: this._paginator.pageIndex,
					pageSize: this._paginator.pageSize,
				}
				: undefined
		);
	}
	private load(
		filter: Filter | undefined,
		sort: Sort | undefined,
		page: Page | undefined
	) {
		this.loadingSubject.next(true);
		this.service
			.find(filter, sort, page)
			.pipe(
				tap({
					next: () => noop,
					error: (err: Error) => {
						console.log(`[datasource] find error: ${err.message}`);
						this.loadingSubject.next(new DatasourceError(err));
					},
					complete: () => this.loadingSubject.next(false)
				})
			)
			.subscribe((models) => this.modelsSubject.next(models));
	}

	public count() {
		console.info("[datasource] count");
		this.countingSubject.next(true);
		this.service
			.count(this._filter)
			.pipe(
				tap({
					next: () => noop,
					error: (err: Error) => {
						console.log(`[datasource] count error: ${err.message}`);
						this.countingSubject.next(new DatasourceError(err));
					},
					complete: () => this.countingSubject.next(false)
				})
			)
			.subscribe((count) => {
				this._length = count;
				this.countSubject.next(count);
			});
	}
}

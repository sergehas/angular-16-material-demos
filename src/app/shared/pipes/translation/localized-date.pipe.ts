import { DatePipe } from "@angular/common";
import {
	ChangeDetectorRef,
	OnDestroy,
	Pipe,
	PipeTransform,
} from "@angular/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { Observable, Subscription, map } from "rxjs";

@Pipe({
	name: "localizedDate",
	pure: false, // required to update the value when the promise is resolved

	standalone: true,
})
export class LocalizedDatePipe implements PipeTransform, OnDestroy {
	constructor(
		private translateService: TranslateService,
		private datePipe: DatePipe,
		private _ref: ChangeDetectorRef
	) {}

	value: string = "";
	lastKey: string | null = null;
	lastData: string | Date | number | null = null;
	lastFormattedDate: string = "";
	onLangChange: Subscription | undefined;

	updateValue(key: string, data: string | Date | number): void {
		console.log("formating ", data, "with key", key);
		let onTranslation = (res: string) => {
			console.log("format is ", res);
			this.value = res !== undefined ? res : key;
			this.lastKey = key;
			this.lastFormattedDate =
				this.datePipe.transform(data, this.value) ?? "";
			console.log("formatted is ", this.lastFormattedDate);

			this._ref.markForCheck();
		};
		this.lastData = data;
		this.translateService.get(key).subscribe(onTranslation);
	}

	transform(data: string | Date | number, formatKey: string): string {
		// if we ask another time for the same key, return the last value
		if (formatKey === this.lastKey && data === this.lastData) {
			console.log("no change");
			return this.lastFormattedDate;
		}
		this.lastKey = formatKey;

		// set the value
		this.updateValue(formatKey, data);
		// if there is a subscription to onLangChange, clean it
		this._dispose();

		// subscribe to onLangChange event, in case the language changes
		if (!this.onLangChange) {
			this.onLangChange = this.translateService.onLangChange.subscribe(
				(event: LangChangeEvent) => {
					if (this.lastKey) {
						this.lastKey = null;
						// we want to make sure it doesn't return the same value until it's been updated
						this.updateValue(formatKey, data);
					}
				}
			);
		}
		return this.lastFormattedDate;
	}

	/**
	 * Clean any existing subscription to change events
	 */
	private _dispose(): void {
		if (typeof this.onLangChange !== "undefined") {
			this.onLangChange.unsubscribe();
			this.onLangChange = undefined;
		}
	}

	ngOnDestroy(): void {
		this._dispose();
	}
}

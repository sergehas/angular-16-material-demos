import { Component, OnDestroy } from "@angular/core";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_DATE_LOCALE,
} from "@angular/material/core";
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from "moment";

const moment = _rollupMoment || _moment;

// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from "moment";
import { Subscription } from "rxjs";

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
const WEEK_FORMATS = {
	parse: {
		dateInput: "YYYY/W",
	},
	display: {
		dateInput: "YYYY/W",
		monthYearLabel: "YYYY",
		dateA11yLabel: "LL",
		monthYearA11yLabel: "YYYY",
	},
};

@Component({
	selector: "app-demo-i18n",
	templateUrl: "./demo-i18n.component.html",
	styleUrls: ["./demo-i18n.component.scss"],
	providers: [
		// `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
		// application's root module. We provide it at the component level here, due to limitations of
		// our example generation script.
		{
			provide: DateAdapter,
			useClass: MomentDateAdapter,
			deps: [MAT_DATE_LOCALE],
		},
		{ provide: MAT_DATE_FORMATS, useValue: WEEK_FORMATS },
	],
})
export class DemoI18nComponent implements OnDestroy {
	private _onLangChange: Subscription | undefined;

	today: Date | number = new Date();

	private _updateFormat() {
		let onTranslation = (res: string) => {
			console.log("week format is ", res);
			WEEK_FORMATS.display.dateInput = res;
			WEEK_FORMATS.parse.dateInput = res;
		};
		this.translateService.get("format.weekYear").subscribe(onTranslation);
	}

	constructor(private translateService: TranslateService) {
		this._updateFormat();

		this._onLangChange = this.translateService.onLangChange.subscribe(
			(event: LangChangeEvent) => {
				// we want to make sure it doesn't return the same value until it's been updated
				this._updateFormat();
			}
		);
	}

	ngOnDestroy(): void {
		if (this._onLangChange) {
			this._onLangChange.unsubscribe();
			this._onLangChange = undefined;
		}
	}

	updateDate() {
		this.today = Date.now();
	}

	setLanguage(locale: string) {
		this.translateService.use(locale);
	}
}

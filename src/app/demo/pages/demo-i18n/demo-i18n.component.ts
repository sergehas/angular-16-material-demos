import { Component, DestroyRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatButton } from "@angular/material/button";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from "@angular/material/datepicker";
import { MatDivider } from "@angular/material/divider";
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { LangChangeEvent, TranslateModule, TranslateService } from "@ngx-translate/core";
import { LocalizedDatePipe } from "../../../shared/pipes/translation/localized-date.pipe";

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
const WEEK_FORMATS = {
  parse: {
    dateInput: "yyyy/W",
  },
  display: {
    dateInput: "yyyy/W",
    monthYearLabel: "yyyy",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "yyyy",
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
  imports: [
    MatDivider,
    MatButton,
    MatFormField,
    MatLabel,
    MatDateRangeInput,
    MatStartDate,
    MatEndDate,
    MatHint,
    MatDatepickerToggle,
    MatSuffix,
    MatDateRangePicker,
    TranslateModule,
    LocalizedDatePipe,
  ],
})
export class DemoI18nComponent {
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  today: Date | number = new Date();

  private _updateFormat() {
    const onTranslation = (res: string) => {
      console.log("week format is ", res);
      WEEK_FORMATS.display.dateInput = res;
      WEEK_FORMATS.parse.dateInput = res;
    };
    this.translateService
      .get("format.weekYear")
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(onTranslation);
  }

  constructor() {
    this._updateFormat();

    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_event: LangChangeEvent) => {
        // we want to make sure it doesn't return the same value until it's been updated
        this._updateFormat();
      });
  }

  updateDate() {
    this.today = Date.now();
  }

  setLanguage(locale: string) {
    this.translateService.use(locale);
  }
}

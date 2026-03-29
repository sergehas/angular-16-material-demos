import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, DestroyRef, Pipe, PipeTransform, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";

@Pipe({
  name: "localizedDate",
  pure: false, // required to update the value when the promise is resolved

  standalone: true,
})
export class LocalizedDatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);
  private readonly datePipe = inject(DatePipe);
  private readonly _ref = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  value = "";
  lastKey: string | null = null;
  lastData: string | Date | number | null = null;
  lastFormattedDate = "";

  updateValue(key: string, data: string | Date | number): void {
    console.log("formatting ", data, "with key", key);
    const onTranslation = (res: string) => {
      console.log("format is ", res);
      this.value = res ?? key;
      this.lastKey = key;
      this.lastFormattedDate = this.datePipe.transform(data, this.value) ?? "";
      console.log("formatted is ", this.lastFormattedDate);

      this._ref.markForCheck();
    };
    this.lastData = data;
    this.translateService
      .get(key)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(onTranslation);
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

    // subscribe to onLangChange event, in case the language changes
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((_event: LangChangeEvent) => {
        if (this.lastKey) {
          this.lastKey = null;
          // we want to make sure it doesn't return the same value until it's been updated
          this.updateValue(formatKey, data);
        }
      });
    return this.lastFormattedDate;
  }
}

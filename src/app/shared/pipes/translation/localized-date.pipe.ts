import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, DestroyRef, Pipe, PipeTransform, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";

@Pipe({
  name: "localizedDate",
  pure: false, // required to update the value when the promise is resolved

  standalone: true,
})
/**
 * An impure pipe that formats a date value according to a locale-aware format key.
 *
 * The format key is resolved via {@link TranslateService} to support i18n date format strings.
 * The pipe re-renders automatically when the application language changes.
 *
 * @example
 * ```html
 * {{ myDate | localizedDate: 'DATE_FORMAT' }}
 * ```
 *
 * @remarks
 * Because the pipe is impure, Angular will call `transform` on every change-detection cycle.
 * Internal caching avoids redundant translation lookups when neither the value nor the key changes.
 */
export class LocalizedDatePipe implements PipeTransform {
  private readonly translateService = inject(TranslateService);
  private readonly datePipe = inject(DatePipe);
  private readonly _ref = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  value = "";
  lastKey: string | null = null;
  lastData: string | Date | number | null = null;
  lastFormattedDate = "";

  /**
   * Fetches the translated date format for `key`, then formats `data` with {@link DatePipe}.
   * Triggers change detection after the formatted value is ready.
   *
   * @param key - The i18n translation key that maps to a {@link DatePipe} format string.
   * @param data - The date value to format (string, Date, or numeric timestamp).
   */
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

  /**
   * Transforms `data` into a locale-aware formatted date string.
   *
   * Results are cached: if both `data` and `formatKey` are identical to the
   * previous call, the cached formatted string is returned immediately.
   *
   * @param data - The date value to format.
   * @param formatKey - The i18n key resolving to a {@link DatePipe} format string.
   * @returns The formatted date string, or an empty string while the translation is pending.
   */
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

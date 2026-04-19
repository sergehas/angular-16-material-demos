import { DatePipe } from "@angular/common";
import { ChangeDetectorRef } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { Subject, of } from "rxjs";
import { LocalizedDatePipe } from "./localized-date.pipe";

describe("LocalizedDatePipe", () => {
  let pipe: LocalizedDatePipe;
  let langChangeSubject: Subject<LangChangeEvent>;
  let translateGetSpy: jasmine.Spy;
  let datePipeTransformSpy: jasmine.Spy;

  beforeEach(() => {
    langChangeSubject = new Subject<LangChangeEvent>();
    translateGetSpy = jasmine.createSpy("get").and.returnValue(of("MM/dd/yyyy"));
    datePipeTransformSpy = jasmine.createSpy("transform").and.returnValue("01/01/2023");

    TestBed.configureTestingModule({
      providers: [
        LocalizedDatePipe,
        { provide: DatePipe, useValue: { transform: datePipeTransformSpy } },
        {
          provide: TranslateService,
          useValue: { get: translateGetSpy, onLangChange: langChangeSubject },
        },
        {
          provide: ChangeDetectorRef,
          useValue: { markForCheck: jasmine.createSpy("markForCheck") },
        },
      ],
    });

    pipe = TestBed.inject(LocalizedDatePipe);
  });

  it("should create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should return cached value when called with same key and data", () => {
    const date = new Date("2023-01-01");
    pipe.transform(date, "DATE_FORMAT");
    const cached = pipe.lastFormattedDate;

    const result = pipe.transform(date, "DATE_FORMAT");

    expect(result).toBe(cached);
    expect(translateGetSpy).toHaveBeenCalledTimes(1);
  });

  it("should call updateValue when called with different data", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-06-15");

    pipe.transform(date1, "DATE_FORMAT");
    pipe.transform(date2, "DATE_FORMAT");

    expect(translateGetSpy).toHaveBeenCalledTimes(2);
  });

  it("should call updateValue when called with a different format key", () => {
    const date = new Date("2023-01-01");

    pipe.transform(date, "DATE_FORMAT");
    pipe.transform(date, "DATETIME_FORMAT");

    expect(translateGetSpy).toHaveBeenCalledTimes(2);
  });

  it("should use format key as fallback when translation returns falsy", () => {
    translateGetSpy.and.returnValue(of(null));
    const date = new Date("2023-01-01");

    pipe.transform(date, "DATE_FORMAT");

    expect(pipe.value).toBe("DATE_FORMAT");
  });

  it("should use empty string when datePipe.transform returns null", () => {
    datePipeTransformSpy.and.returnValue(null);
    const date = new Date("2023-01-01");

    pipe.transform(date, "DATE_FORMAT");

    expect(pipe.lastFormattedDate).toBe("");
  });

  it("should call updateValue on language change when lastKey is set", () => {
    const date = new Date("2023-01-01");
    pipe.transform(date, "DATE_FORMAT");
    expect(translateGetSpy).toHaveBeenCalledTimes(1);

    langChangeSubject.next({ lang: "fr-FR", translations: {} } as LangChangeEvent);

    expect(translateGetSpy).toHaveBeenCalledTimes(2);
  });

  it("should not call updateValue on language change when lastKey is null", () => {
    const date = new Date("2023-01-01");
    pipe.transform(date, "DATE_FORMAT");
    pipe.lastKey = null; // force null to cover the false branch
    translateGetSpy.calls.reset();

    langChangeSubject.next({ lang: "fr-FR", translations: {} } as LangChangeEvent);

    expect(translateGetSpy).not.toHaveBeenCalled();
  });
});

import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import { Observable, of, Subject } from "rxjs";
import { DemoModule } from "../../demo.module";
import { DemoI18nComponent } from "./demo-i18n.component";

// Mock TranslateService
const translateServiceMock = {
  get: (key: string): Observable<string> => of(key),
  onLangChange: new Subject(),
  use: (lang: string): Observable<string> => of(lang),
};

// Mock DatePipe
const datePipeMock = {
  transform: (date: any, format: string) => `Mocked Date: ${date}`,
};

// Mock TranslatePipe
@Pipe({
  name: "translate",
})
export class TranslateMockPipe implements PipeTransform {
  public name: string = "translate";

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

describe("DemoI18nComponent", () => {
  let component: DemoI18nComponent;
  let fixture: ComponentFixture<DemoI18nComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [DemoModule, NoopAnimationsModule],
      declarations: [DemoI18nComponent, TranslateMockPipe],
      providers: [
        DatePipe,
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: TranslatePipe, UseValue: TranslateMockPipe },
      ],
    });
    fixture = TestBed.createComponent(DemoI18nComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit("should create", () => {
    expect(component).toBeTruthy();
  });
});

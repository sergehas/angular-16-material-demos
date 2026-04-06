import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DomSanitizer } from "@angular/platform-browser";
import { provideTranslateService, TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { BehaviorSubject, Observable, of } from "rxjs";

import { Theme } from "@app/core/theme/theme.model";
import { ThemeService } from "@app/core/theme/theme.service";
import { ThemePickerComponent } from "./theme-picker.component";

const THEMES: Theme[] = [
  { className: "first-theme", name: "First" },
  { className: "second-theme", name: "Second" },
];

const themeSubjectMock = new BehaviorSubject<string>(THEMES[0].className);

class MockThemeService {
  selectedTheme = themeSubjectMock.asObservable();

  getThemeList(): Theme[] {
    return THEMES;
  }

  setTheme(key: string): void {
    themeSubjectMock.next(key);
  }
}

class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    void lang;
    return of({ TEST: "This is a test" });
  }
}

describe("ThemePickerComponent", () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let mockThemeService: MockThemeService;

  beforeEach(async () => {
    mockThemeService = new MockThemeService();

    await TestBed.configureTestingModule({
      imports: [
        ThemePickerComponent,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
      ],
      providers: [
        {
          provide: ThemeService,
          useValue: mockThemeService,
        },
        provideTranslateService({}),
        { provide: TranslateLoader, useClass: MockTranslateLoader },
      ],
    });
    const _registry = TestBed.inject(MatIconRegistry);
    const _sanitizer = TestBed.inject(DomSanitizer);
    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should install theme based on key", () => {
    spyOn(mockThemeService, "setTheme");
    const key = THEMES[1].className;
    component.selectTheme(key);
    expect(mockThemeService.setTheme).toHaveBeenCalledWith(key);
  });

  it("should NOT install theme based on NOT existing key", () => {
    spyOn(mockThemeService, "setTheme");
    component.selectTheme("does not exist");
    expect(mockThemeService.setTheme).not.toHaveBeenCalled();
  });

  it("should track themes by key for performance", () => {
    const trackByResult = component.trackByThemeKey(0, THEMES[0]);
    expect(trackByResult).toBe(THEMES[0].className);
  });
});

import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { provideTranslateService, TranslateLoader, TranslationObject } from "@ngx-translate/core";
import { Observable, of } from "rxjs";

import { Theme, ThemeScheme } from "@app/core/theme/theme.model";
import { ThemeService } from "@app/core/theme/theme.service";
import { ThemePickerComponent } from "./theme-picker.component";

const THEMES: Theme[] = [new Theme("first-theme", "First"), new Theme("second-theme", "Second")];

const themeSubjectMock = signal<Theme>(THEMES[0]);
const schemeSubjectMock = signal<ThemeScheme>(ThemeScheme.AUTO);

class MockThemeService {
  selectedTheme = themeSubjectMock;
  themeScheme = schemeSubjectMock;

  getThemeList(): Theme[] {
    return THEMES;
  }

  setTheme(theme: Theme): void {
    themeSubjectMock.set(theme);
  }

  setThemeScheme(scheme: ThemeScheme): void {
    schemeSubjectMock.set(scheme);
  }
}

class MockTranslateLoader implements TranslateLoader {
  getTranslation(_lang: string): Observable<TranslationObject> {
    return of({ TEST: "This is a test" });
  }
}

describe("ThemePickerComponent", () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let mockThemeService: MockThemeService;

  beforeEach(async () => {
    mockThemeService = new MockThemeService();

    TestBed.configureTestingModule({
      imports: [
        ThemePickerComponent,
        MatMenuModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatListModule,
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

    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create and initialize theme picker", () => {
    expect(component).toBeTruthy();
    expect(component["themes"].length).toBe(THEMES.length);
  });

  it("should update currentTheme through effect when service theme changes", (done) => {
    mockThemeService.selectedTheme.set(THEMES[1]);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component["currentTheme"]).toBe(THEMES[1]);
      done();
    });
  });

  it("should update currentScheme through effect when service scheme changes", (done) => {
    mockThemeService.themeScheme.set(ThemeScheme.DARK);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component["currentScheme"]).toBe(ThemeScheme.DARK);
      done();
    });
  });

  it("should install theme when selectTheme is called with existing theme", () => {
    spyOn(mockThemeService, "setTheme");
    const theme = THEMES[1];
    component.selectTheme(theme);
    expect(mockThemeService.setTheme).toHaveBeenCalledWith(theme);
  });

  it("should NOT install theme for a non-existing theme object", () => {
    spyOn(mockThemeService, "setTheme");
    component.selectTheme({ className: "does-not-exist", name: "Does Not Exist" } as Theme);
    expect(mockThemeService.setTheme).not.toHaveBeenCalled();
  });

  it("should select scheme with valid ThemeScheme value", () => {
    spyOn(mockThemeService, "setThemeScheme");
    component.selectScheme(ThemeScheme.LIGHT);
    expect(mockThemeService.setThemeScheme).toHaveBeenCalledWith(ThemeScheme.LIGHT);
  });

  it("should default to AUTO scheme when selectScheme is called with undefined", () => {
    spyOn(mockThemeService, "setThemeScheme");
    component.selectScheme(undefined);
    expect(mockThemeService.setThemeScheme).toHaveBeenCalledWith(ThemeScheme.AUTO);
  });

  it("should track themes by className key for performance", () => {
    const trackByResult = component.trackByThemeKey(0, THEMES[0]);
    expect(trackByResult).toBe(THEMES[0].className);
  });

  it("should return correct className for all themes in trackByThemeKey", () => {
    THEMES.forEach((theme, index) => {
      expect(component.trackByThemeKey(index, theme)).toBe(theme.className);
    });
  });
});

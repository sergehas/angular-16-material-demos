import { DOCUMENT } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import { ThemeService } from "./theme.service";

describe("ThemeService", () => {
  let service: ThemeService;
  let mockClassList: {
    add: (className: string) => void;
    remove: (...classNames: string[]) => void;
    contains: (className: string) => boolean;
    forEach: (callback: (className: string) => void) => void;
    toArray: () => string[];
  };

  const createMockClassList = (classes: string[]) => {
    const set = new Set(classes);

    return {
      add(className: string) {
        set.add(className);
      },
      remove(...classNames: string[]) {
        classNames.forEach((className) => set.delete(className));
      },
      contains(className: string) {
        return set.has(className);
      },
      forEach(callback: (className: string) => void) {
        Array.from(set).forEach(callback);
      },
      toArray() {
        return Array.from(set);
      },
    };
  };

  beforeEach(() => {
    mockClassList = createMockClassList(["dark"]);

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });

    service = TestBed.inject(ThemeService);
  });

  it("should be created and use the document body class list", () => {
    expect(service).toBeTruthy();
    expect(service.themeScheme()).toBe("dark");
  });

  it("should switch to light theme scheme", () => {
    service.setThemeScheme("light");

    expect(mockClassList.contains("light")).toBeTrue();
    expect(mockClassList.contains("dark")).toBeFalse();
    expect(service.themeScheme()).toBe("light");
  });

  it("should switch to dark theme scheme", () => {
    service.setThemeScheme("dark");

    expect(mockClassList.contains("dark")).toBeTrue();
    expect(mockClassList.contains("light")).toBeFalse();
    expect(service.themeScheme()).toBe("dark");
  });

  it("should clear theme flags for auto scheme and default to light when dark is absent", () => {
    service.setThemeScheme("auto");

    expect(mockClassList.contains("light")).toBeFalse();
    expect(mockClassList.contains("dark")).toBeFalse();
    expect(service.themeScheme()).toBe("light");
  });

  it("should remove existing theme classes and add the selected theme class", () => {
    mockClassList = createMockClassList(["dark-theme", "light-theme"]);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: DOCUMENT, useValue: { body: { classList: mockClassList } } },
      ],
    });
    service = TestBed.inject(ThemeService);

    service.setTheme("blue");

    expect(mockClassList.contains("blue-theme")).toBeTrue();
    expect(mockClassList.contains("dark-theme")).toBeFalse();
    expect(mockClassList.contains("light-theme")).toBeFalse();
  });
});

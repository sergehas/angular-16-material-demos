import { Theme, ThemeScheme } from "./theme.model";

describe("Theme", () => {
  it("should create an instance with className and name", () => {
    const theme = new Theme("test-theme", "Test Theme");
    expect(theme).toBeTruthy();
    expect(theme.className).toBe("test-theme");
    expect(theme.name).toBe("Test Theme");
  });

  it("should return true when comparing themes with same className", () => {
    const theme1 = new Theme("test-theme", "Test Theme");
    const theme2 = new Theme("test-theme", "Different Name");

    expect(theme1.equals(theme2)).toBeTrue();
  });

  it("should return false when comparing themes with different className", () => {
    const theme1 = new Theme("test-theme", "Test Theme");
    const theme2 = new Theme("another-theme", "Test Theme");

    expect(theme1.equals(theme2)).toBeFalse();
  });

  it("should return false when comparing with undefined", () => {
    const theme1 = new Theme("test-theme", "Test Theme");

    expect(theme1.equals(undefined)).toBeFalse();
  });
});

describe("ThemeScheme", () => {
  it("should have LIGHT constant", () => {
    expect(ThemeScheme.LIGHT).toBe("light");
  });

  it("should have DARK constant", () => {
    expect(ThemeScheme.DARK).toBe("dark");
  });

  it("should have AUTO constant", () => {
    expect(ThemeScheme.AUTO).toBe("auto");
  });
});

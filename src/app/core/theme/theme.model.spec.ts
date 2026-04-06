import { Theme } from "./theme.model";

describe("Theme", () => {
  it("should create an instance", () => {
    expect(new Theme("test-theme", "Test Theme")).toBeTruthy();
  });
  it("should compare themes correctly", () => {
    const theme1 = new Theme("test-theme", "Test Theme");
    const theme2 = new Theme("test-theme", "Test Theme");
    const theme3 = new Theme("another-theme", "Another Theme");

    expect(theme1.equals(theme2)).toBeTrue();
    expect(theme1.equals(theme3)).toBeFalse();
    expect(theme1.equals(undefined)).toBeFalse();
  });
});

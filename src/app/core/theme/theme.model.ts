export class Theme {
  className: string;
  name: string;

  constructor(className: string, name: string) {
    this.className = className;
    this.name = name;
  }
}

export class ThemeScheme {
  static readonly LIGHT = "light";
  static readonly DARK = "dark";
  static readonly AUTO = "auto";
}

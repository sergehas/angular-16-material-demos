export class Theme {
  readonly className: string;
  readonly name: string;

  constructor(className: string, name: string) {
    this.className = className;
    this.name = name;
  }
  equals(other: Theme | undefined): boolean {
    return !!other && this.className === other.className;
  }
}

export class ThemeScheme {
  static readonly LIGHT = "light";
  static readonly DARK = "dark";
  static readonly AUTO = "auto";
}

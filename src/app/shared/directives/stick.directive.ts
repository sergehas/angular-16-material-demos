import { AfterViewChecked, Directive, ElementRef, Input, Renderer2, inject } from "@angular/core";
import { ScrollService } from "src/app/core/services/scroll.service";

function htmlElementAttribute(value: unknown): HTMLElement {
  if (value instanceof HTMLElement) {
    return value as HTMLElement;
  }
  throw new Error(`${String(value)} is not an HTML element`);
}

@Directive({
  selector: "[appStick]",
  standalone: true,
})
export class StickDirective implements AfterViewChecked {
  private element = inject<ElementRef<HTMLElement>>(ElementRef);
  private scrollService = inject(ScrollService);
  private renderer = inject(Renderer2);

  @Input({ required: true, transform: htmlElementAttribute })
  appStick!: HTMLElement;

  private _native: HTMLElement;
  private _ref!: number;
  private _original!: number;

  private requiredStyles: Record<string, string | number> = {
    "width": "100%",
    "z-index": 2, //ensure to be on top of mat button (z-index:1)
    "transition": "top,left 0.05s",
    "position": "absolute",
    "left": 0,
    "top": "",
  };

  constructor() {
    // afterRender(() => {
    //   console.log("AFTER")
    // });
    this._native = this.element.nativeElement;
  }
  ngAfterViewChecked(): void {
    this.renderer.setStyle(this.appStick, "position", "relative");
    this._ref = this.appStick.getBoundingClientRect().top;
    this._original = this.element.nativeElement.getBoundingClientRect().top;
    console.log(`el position:${this._original}, ref position: ${this._ref}`);
    this.renderer.addClass(this._native, "app-stickable");

    this.scrollService.scrolling$.subscribe(() => {
      this.onViewportScroll();
    });
  }

  // @HostListener('window:scroll', ['$event'])
  onViewportScroll() {
    //scroll is required as soon as "sticky" element top position is less than reference top position
    const offsetRef = this.appStick.getBoundingClientRect().top;
    const targetPos = this._ref - offsetRef;
    const shouldScroll = targetPos > this._original - this._ref;
    if (shouldScroll) {
      this.renderer.addClass(this._native, "app-sticked");
      Object.keys(this.requiredStyles).forEach((newStyle) => {
        this.renderer.setStyle(
          this._native,
          `${newStyle}`,
          newStyle === "top" ? `${targetPos}px` : this.requiredStyles[newStyle]
        );
      });
    } else {
      this.renderer.removeClass(this._native, "app-sticked");
      Object.keys(this.requiredStyles).forEach((newStyle) => {
        this.renderer.removeStyle(this._native, `${newStyle}`);
      });
    }
  }
}

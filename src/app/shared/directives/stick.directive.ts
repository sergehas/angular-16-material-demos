import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ScrollService } from 'src/app/core/services/scroll.service';


function htmlElementAttribute(value: unknown): HTMLElement {
  if (value instanceof HTMLElement) {
    return value as HTMLElement
  }
  throw new Error(`${String(value)} is not an HTML element`)
}

@Directive({
  selector: '[appStick]',
  standalone: true
})
export class StickDirective implements AfterViewInit {
  @Input({ required: true, transform: htmlElementAttribute }) appStick!: HTMLElement;

  private _native: HTMLElement;
  private _ref!: number;
  private _original!: number;

  private requiredStyles: Record<string, string | number> = {
    'width': '100%',
    'z-index': 2, //ensure to be on top of mat button (z-index:1)
    'transition': 'top 0.05s',
    'position': 'absolute',
    'left': 0,
    'top': '',
  };


  constructor(private element: ElementRef<HTMLElement>, private scrollService: ScrollService, private renderer: Renderer2) {
    this._native = this.element.nativeElement;
  }
  ngAfterViewInit(): void {
    this.renderer.setStyle(this.appStick, "position", "relative");
    this.renderer.addClass(this._native, "app-stick");
    this._ref = this.appStick.getBoundingClientRect().top;
    this._original = this.element.nativeElement.getBoundingClientRect().top;
    console.log(`el position:${this._original}, ref position: ${this._ref}`)

    this.scrollService.scrolling$.subscribe(() => {
      this.onViewportScroll();
    });


  }

  // @HostListener('window:scroll', ['$event'])
  onViewportScroll() {
    //scroll is required as soon as "sticky" element top position is less than reference top position
    let offsetRef = this.appStick.getBoundingClientRect().top;
    let targetPos = this._ref - offsetRef;
    let shouldScroll = targetPos > (this._original - this._ref);
    if (shouldScroll) {
      Object.keys(this.requiredStyles).forEach(newStyle => {
        this.renderer.setStyle(
          this._native, `${newStyle}`, newStyle === 'top' ? `${targetPos}px` : this.requiredStyles[newStyle]
        );
      });
    } else {
      Object.keys(this.requiredStyles).forEach(newStyle => {
        this.renderer.removeStyle(
          this._native, `${newStyle}`
        )
      })
    };
  }
}

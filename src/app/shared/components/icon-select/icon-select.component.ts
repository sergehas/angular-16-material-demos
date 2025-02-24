import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  Optional,
  Output,
  Self,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ErrorStateMatcher, MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";

import { FocusMonitor } from "@angular/cdk/a11y";
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgControl,
  NgForm,
} from "@angular/forms";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subscription } from "rxjs";

import { MatButtonModule } from "@angular/material/button";
import { AbstractMatFormField } from "../abstract-mat-form-field";
import { IconTreeComponent } from "../icon-tree/icon-tree.component";
/**
 *
 *
 * @export
 * @class IconSelectComponent
 * @extends {AbstractMatFormField<string>} to inherit of almost all behaviors & attributes of a form field
 * @implements {AfterViewInit} for subscribing on value change of nested component
 * @implements {OnDestroy} to destroy subscription
 */
@Component({
  selector: "app-icon-select",
  templateUrl: "./icon-select.component.html",
  styleUrls: ["./icon-select.component.scss"],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    IconTreeComponent,

    MatRippleModule,
    FormsModule,
  ],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: forwardRef(() => IconSelectComponent),
    },
  ],
})
export class IconSelectComponent
  extends AbstractMatFormField<string>
  implements AfterViewInit, OnDestroy
{
  private subscription: Subscription | null = null;
  protected control = new FormControl();
  //visual element to  focus
  @ViewChild("button", { static: false })
  private readonly ctrl: HTMLElement | undefined;
  @ViewChild(MatMenuTrigger) iconMenu: MatMenuTrigger | null = null;

  /* input value & output valueChange work together */
  @Output() valueChange = new EventEmitter<string | null>();
  @Input()
  override set value(v: string | null) {
    super.value = v;
    this.valueChange.emit(this.value);
  }
  override get value(): string | null {
    return super.value;
  }
  @Input()
  public tooltip: string = "";

  constructor(
    @Optional() @Self() ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    _focusMonitor: FocusMonitor,
    _elementRef: ElementRef
  ) {
    super(
      "app-icon-select",
      ngControl,
      _parentForm,
      _parentFormGroup,
      _defaultErrorStateMatcher,
      _focusMonitor,
      _elementRef
    );
  }

  public onSelectionChange(value: string | null) {
    this.value = value;
  }

  public ngAfterViewInit(): void {
    this.subscription = this.valueChange.subscribe((value) => {
      this.iconMenu?.closeMenu();
      super.value = value;
    });
  }

  public override ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  public focus(): void {
    this.ctrl!.focus();
  }
}

import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import {
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Self,
} from "@angular/core";
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from "@angular/forms";
import { ErrorStateMatcher, mixinErrorState } from "@angular/material/core";
import { MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";

const _AbstractMatFormField = mixinErrorState(
  class {
    /**
     * Emits whenever the component state changes and should cause the parent
     * form field to update. Implemented as part of `MatFormFieldControl`.
     * @docs-private
     */
    readonly stateChanges = new Subject<void>();

    constructor(
      public _defaultErrorStateMatcher: ErrorStateMatcher,
      public _parentForm: NgForm,
      public _parentFormGroup: FormGroupDirective,
      /**
       * Form control bound to the component.
       * Implemented as part of `MatFormFieldControl`.
       * @docs-private
       */
      public ngControl: NgControl
    ) {}
  }
);
@Directive()
export abstract class AbstractMatFormField<T>
  extends mixinErrorState(_AbstractMatFormField)
  implements DoCheck, OnDestroy, ControlValueAccessor, MatFormFieldControl<T>
{
  protected onChange?: (value: T | null) => void;
  protected onTouched?: () => void;

  private static nextId: number = 0;

  @HostBinding()
  public id: string = `${this.controlType}-${AbstractMatFormField.nextId++}`;

  @HostBinding("attr.aria-describedBy")
  public describedBy: string = "";

  constructor(
    public readonly controlType: string,
    // ErrorStateMixin
    @Optional() @Self() ngControl: NgControl,
    @Optional() _parentForm: NgForm,
    @Optional() _parentFormGroup: FormGroupDirective,
    _defaultErrorStateMatcher: ErrorStateMatcher,
    // FocusMonitor
    protected readonly _focusMonitor: FocusMonitor,
    protected readonly _elementRef: ElementRef
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    _focusMonitor.monitor(this._elementRef.nativeElement, true).subscribe((origin) => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  public ngDoCheck(): void {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  public ngOnDestroy(): void {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
  }

  public registerOnChange(fn: (_: T | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public writeValue(value: T): void {
    this.value = value;
  }

  private _value: T | null = null;

  public set value(value: T | null) {
    this._value = value;
    if (this.onChange) {
      this.onChange(value);
    }
  }

  public get value(): T | null {
    return this._value;
  }

  public get empty(): boolean {
    return !this._value;
  }

  public setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(" ");
  }

  public _placeholder: string = "";

  @Input()
  public set placeholder(placeholder: string) {
    this._placeholder = placeholder;
    this.stateChanges.next();
  }

  public get placeholder() {
    return this._placeholder;
  }

  public _required: boolean = false;

  @Input()
  public set required(required: boolean) {
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }

  public get required() {
    return this._required;
  }

  public _disabled: boolean = false;

  @Input()
  public set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);

    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  public get disabled() {
    if (this.ngControl && this.ngControl.disabled !== null) {
      return this.ngControl.disabled;
    }
    return this._disabled;
  }

  public focused = false;

  public abstract focus(): void;

  @HostListener("focusout")
  onBlur() {
    this.focused = false;
    if (this.onTouched) {
      this.onTouched();
    }
    this.stateChanges.next();
  }

  public get shouldLabelFloat(): boolean {
    return this.focused || !this.empty;
  }

  public onContainerClick(): void {
    if (!this.focused) {
      this.focus();
    }
  }
}

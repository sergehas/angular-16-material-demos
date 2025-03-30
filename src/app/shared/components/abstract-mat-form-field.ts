import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { Platform } from "@angular/cdk/platform";
import { AutofillMonitor } from "@angular/cdk/text-field";
import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  DoCheck,
  ElementRef,
  inject,
  InjectionToken,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Renderer2,
  input,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  Validators,
} from "@angular/forms";
import { _ErrorStateTracker, ErrorStateMatcher } from "@angular/material/core";
import { MAT_FORM_FIELD, MatFormField, MatFormFieldControl } from "@angular/material/form-field";
import { Subject } from "rxjs";
import { IdGenerator } from "./id-generator";

/** Object that can be used to configure the default options for the input. */
export interface MatFieldConfig {
  /** Whether disabled inputs should be interactive. */
  disabledInteractive?: boolean;
}

/** Injection token that can be used to provide the default options for the input. */
export const APP_FIELD_CONFIG = new InjectionToken<MatFieldConfig>("APP_FIELD_CONFIG");

@Directive({})
export abstract class AbstractMatFormField<T>
  implements
    MatFormFieldControl<T>,
    ControlValueAccessor,
    OnChanges,
    OnDestroy,
    AfterViewInit,
    DoCheck
{
  protected readonly _elementRef = inject(ElementRef);
  protected _platform = inject(Platform);
  ngControl = inject(NgControl, { optional: true, self: true })!;
  private readonly _autofillMonitor = inject(AutofillMonitor);
  private readonly _ngZone = inject(NgZone);
  protected _formField? = inject<MatFormField>(MAT_FORM_FIELD, { optional: true });
  private readonly _renderer = inject(Renderer2);

  protected _previousNativeValue: T | null;
  private _previousPlaceholder: string | null = null;
  private readonly _focusMonitor = inject(FocusMonitor);
  private readonly _errorStateTracker: _ErrorStateTracker;
  private readonly _config = inject(APP_FIELD_CONFIG, { optional: true });
  private _cleanupIosKeyup: (() => void) | undefined;

  /** `aria-describedby` IDs assigned by the form field. */
  private _formFieldDescribedBy: string[] | undefined;

  /** Whether the component is being rendered on the server. */
  readonly _isServer: boolean;

  /** Whether the input is inside of a form field. */
  readonly _isInFormField: boolean;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  focused = false;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  readonly stateChanges: Subject<void> = new Subject<void>();

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  controlType = "mat-abstract-field";

  protected _uid = inject(IdGenerator).getId(this.controlType);

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  autofilled = false;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);

    // Browsers may not fire the blur event if the input is disabled too quickly.
    // Reset from here to ensure that the element doesn't become stuck.
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  protected _disabled = false;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
  }
  protected _id!: string;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input() placeholder = "";

  /**
   * Name of the input.
   * @docs-private
   */
  readonly name = input("");

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  get required(): boolean {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  protected _required: boolean | undefined;

  /** An object used to control when error messages are shown. */
  @Input()
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value: ErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  /* eslint-disable @angular-eslint/no-input-rename */
  @Input("aria-describedby") userAriaDescribedBy?: string;

  private _value: T | null = null;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input()
  public get value(): T | null {
    return this._value;
  }
  set value(value: T | null) {
    this._value = value;
    this._onChange(value);
    this.stateChanges.next();
  }

  /** `View -> model callback called when value changes` */
  _onChange: (value: T | null) => void = () => {
    /** default function, noop */
  };

  /** `View -> model callback called when select has been touched` */
  _onTouched = () => {
    /** default function, noop */
  };

  /** Whether the element is readonly. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: BooleanInput) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;

  /** Whether the input should remain interactive when it is disabled. */
  @Input({ transform: booleanAttribute })
  disabledInteractive: boolean;

  /** Whether the input is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

  constructor(...args: unknown[]);

  constructor() {
    const parentForm = inject(NgForm, { optional: true });
    const parentFormGroup = inject(FormGroupDirective, { optional: true });
    const defaultErrorStateMatcher = inject(ErrorStateMatcher);

    const element = this._elementRef.nativeElement;
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this._focusMonitor
      .monitor(this._elementRef.nativeElement, true)
      .subscribe((origin: FocusOrigin) => {
        this.focused = !!origin;
        this.stateChanges.next();
      });

    this._previousNativeValue = this.value;

    /* eslint-disable  no-self-assign -- Force setter to be called in case id was not specified.. */
    this.id = this.id;

    // On some versions of iOS the caret gets stuck in the wrong place when holding down the delete
    // key. In order to get around this we need to "jiggle" the caret loose. Since this bug only
    // exists on iOS, we only bother to install the listener on iOS.
    if (this._platform.IOS) {
      this._ngZone.runOutsideAngular(() => {
        this._cleanupIosKeyup = this._renderer.listen(element, "keyup", this._iOSKeyupListener);
      });
    }

    this._errorStateTracker = new _ErrorStateTracker(
      defaultErrorStateMatcher,
      this.ngControl,
      parentFormGroup,
      parentForm,
      this.stateChanges
    );
    this._isServer = !this._platform.isBrowser;
    this._isInFormField = !!this._formField;
    this.disabledInteractive = this._config?.disabledInteractive || false;
  }

  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor
        .monitor(this._elementRef.nativeElement)
        .subscribe((event: { isAutofilled: boolean }) => {
          this.autofilled = event.isAutofilled;
          this.stateChanges.next();
        });
    }
  }

  ngOnChanges() {
    this.stateChanges.next();
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);

    if (this._platform.isBrowser) {
      this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
    }

    this._cleanupIosKeyup?.();
  }

  public registerOnChange(fn: (_: T | null) => void): void {
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public writeValue(value: T): void {
    this.value = value;
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();

      // Since the input isn't a `ControlValueAccessor`, we don't have a good way of knowing when
      // the disabled state has changed. We can't use the `ngControl.statusChanges`, because it
      // won't fire if the input is disabled with `emitEvents = false`, despite the input becoming
      // disabled.
      if (this.ngControl.disabled !== null && this.ngControl.disabled !== this.disabled) {
        this.disabled = this.ngControl.disabled;
        this.stateChanges.next();
      }
    }

    // We need to dirty-check the native element's value, because there are some cases where
    // we won't be notified when it changes (e.g. the consumer isn't using forms or they're
    // updating the value using `emitEvent: false`).
    this._dirtyCheckNativeValue();

    // We need to dirty-check and set the placeholder attribute ourselves, because whether it's
    // present or not depends on a query which is prone to "changed after checked" errors.
    this._dirtyCheckPlaceholder();
  }

  /** Focuses the input. */
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  /** Refreshes the error state of the input. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  /** Callback for the cases where the focused state of the input changes. */
  _focusChanged(isFocused: boolean) {
    if (isFocused === this.focused) {
      return;
    }
    this.focused = isFocused;
    this.stateChanges.next();
  }

  _onInput() {
    // This is a noop function and is used to let Angular know whenever the value changes.
    // Angular will run a new change detection each time the `input` event has been dispatched.
    // It's necessary that Angular recognizes the value change, because when floatingLabel
    // is set to false and Angular forms aren't used, the placeholder won't recognize the
    // value changes and will not disappear.
    // Listening to the input event wouldn't be necessary when the input is using the
    // FormsModule or ReactiveFormsModule, because Angular forms also listens to input events.
  }

  /** Does some manual dirty checking on the native input `value` property. */
  protected _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;

    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }

  /** Does some manual dirty checking on the native input `placeholder` attribute. */
  private _dirtyCheckPlaceholder() {
    const placeholder = this._getPlaceholder();
    if (placeholder !== this._previousPlaceholder) {
      const element = this._elementRef.nativeElement;
      this._previousPlaceholder = placeholder;
      if (placeholder) {
        element.setAttribute("placeholder", placeholder);
      } else {
        element.removeAttribute("placeholder");
      }
    }
  }

  /** Gets the current placeholder of the form field. */
  protected _getPlaceholder(): string | null {
    return this.placeholder || null;
  }

  /** Checks whether the input is invalid based on the native validation. */
  protected _isBadInput() {
    // The `validity` property won't be present on platform-server.
    const validity = (this._elementRef.nativeElement as HTMLInputElement).validity;
    return validity?.badInput;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return !this.value && !this._isBadInput() && !this.autofilled;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat(): boolean {
    return (this.focused && !this.disabled) || !this.empty;
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute("aria-describedby");
    let toAssign: string[];

    // In some cases there might be some `aria-describedby` IDs that were assigned directly,
    // like by the `AriaDescriber` (see #30011). Attempt to preserve them by taking the previous
    // attribute value and filtering out the IDs that came from the previous `setDescribedByIds`
    // call. Note the `|| ids` here allows us to avoid duplicating IDs on the first render.
    if (existingDescribedBy) {
      const exclude = this._formFieldDescribedBy || ids;
      toAssign = ids.concat(
        existingDescribedBy.split(" ").filter((id: string) => id && !exclude.includes(id))
      );
    } else {
      toAssign = ids;
    }

    this._formFieldDescribedBy = ids;

    if (toAssign.length) {
      element.setAttribute("aria-describedby", toAssign.join(" "));
    } else {
      element.removeAttribute("aria-describedby");
    }
  }

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  onContainerClick() {
    // Do not re-focus the input element if the element is already focused. Otherwise it can happen
    // that someone clicks on a time input and the cursor resets to the "hours" field while the
    // "minutes" field was actually clicked. See: https://github.com/angular/components/issues/12849
    if (!this.focused) {
      this.focus();
    }
  }

  private readonly _iOSKeyupListener = (event: Event): void => {
    const el = event.target as HTMLInputElement;

    // Note: We specifically check for 0, rather than `!el.selectionStart`, because the two
    // indicate different things. If the value is 0, it means that the caret is at the start
    // of the input, whereas a value of `null` means that the input doesn't support
    // manipulating the selection range. Inputs that don't support setting the selection range
    // will throw an error so we want to avoid calling `setSelectionRange` on them. See:
    // https://html.spec.whatwg.org/multipage/input.html#do-not-apply
    if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
      // Note: Just setting `0, 0` doesn't fix the issue. Setting
      // `1, 1` fixes it for the first time that you type text and
      // then hold delete. Toggling to `1, 1` and then back to
      // `0, 0` seems to completely fix it.
      el.setSelectionRange(1, 1);
      el.setSelectionRange(0, 0);
    }
  };

  /** Gets the value to set on the `readonly` attribute. */
  protected _getReadonlyAttribute(): string | null {
    if (this.readonly || (this.disabled && this.disabledInteractive)) {
      return "true";
    }

    return null;
  }
}

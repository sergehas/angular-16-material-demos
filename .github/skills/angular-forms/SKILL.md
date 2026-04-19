---
name: angular-forms
description: "Angular reactive forms patterns, validators, ControlValueAccessor, typed FormGroup. Use when working with forms, form fields, validation, or custom form controls."
---

# Angular Forms Skill

## Typed Reactive Forms

```typescript
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { inject } from "@angular/core";

interface UserForm {
  name: FormControl<string>;
  email: FormControl<string | null>;
}

@Component({ standalone: true, imports: [ReactiveFormsModule] })
export class UserFormComponent {
  private fb = inject(FormBuilder);

  form: FormGroup<UserForm> = this.fb.group({
    name: this.fb.nonNullable.control("", [Validators.required, Validators.minLength(2)]),
    email: ["", [Validators.required, Validators.email]],
  });

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue(); // typed
  }
}
```

## Custom Validators

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasWhitespace = (control.value ?? "").trim().length === 0 && control.value?.length > 0;
    return hasWhitespace ? { whitespace: true } : null;
  };
}
```

## ControlValueAccessor (Custom Form Control)

```typescript
@Component({
  selector: "app-custom-input",
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: CustomInputComponent, multi: true }],
})
export class CustomInputComponent implements ControlValueAccessor {
  value = "";
  isDisabled = false;

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val ?? "";
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}
```

## Template Pattern

```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <mat-form-field appearance="outline">
    <mat-label>Name</mat-label>
    <input matInput formControlName="name" />
    @if (form.controls.name.hasError('required')) {
    <mat-error>Name is required</mat-error>
    }
  </mat-form-field>
  <button mat-raised-button type="submit" [disabled]="form.invalid">Save</button>
</form>
```

## Forms Checklist

- [ ] Use `FormBuilder.nonNullable` for required string fields
- [ ] Typed `FormGroup<T>` with explicit interface
- [ ] All validators declared on the control (not in template)
- [ ] Error messages shown only when `touched` or `dirty`
- [ ] `ControlValueAccessor` used for custom form controls (not two-way binding)
- [ ] Never use `@Input()` for `value` in a custom form control — use CVA

## Reference

- [Reactive Forms Guide](https://angular.dev/guide/forms/reactive-forms)
- [Custom Validators](https://angular.dev/guide/forms/form-validation#custom-validators)
- [ControlValueAccessor](https://angular.dev/api/forms/ControlValueAccessor)

import { Directive, ElementRef, EventEmitter, OnInit, Output, inject, input } from "@angular/core";
import { LoginService, Role } from "src/app/core/services/login.service";

@Directive({
  selector: "[appAllRoles]",
  standalone: true,
})
export class AnyRolesDirective implements OnInit {
  private readonly _elementRef = inject(ElementRef);
  private readonly _loginService = inject(LoginService);

  readonly roles = input<string[] | Role[] | undefined>([], { alias: "appAllRoles" });

  @Output() granted = new EventEmitter<boolean>();

  ngOnInit() {
    if (!this.roles || this.roles.length === 0) {
      console.log(`[appAllRoles] no roles provided [${this.roles}]: grant access`);
      this.granted.emit(true);
      return;
    }
    const hasAccess = this._loginService.getLoggedUser().hasAllRoles(this.roles() as Role[]);
    console.log(`[appAllRoles] has access for roles [${this.roles}]: ${hasAccess}`);
    this.granted.emit(hasAccess);
    //still usefull ?
    //if (!hasAccess) this._elementRef.nativeElement.style.display = "none";
  }
}

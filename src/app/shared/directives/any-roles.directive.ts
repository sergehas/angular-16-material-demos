import { Directive, ElementRef, OnInit, inject, input, output } from "@angular/core";
import { LoginService, Role } from "src/app/core/services/login.service";

@Directive({
  selector: "[appAnyRoles]",
  standalone: true,
})
export class AnyRolesDirective implements OnInit {
  private readonly _elementRef = inject(ElementRef);
  private readonly _loginService = inject(LoginService);

  readonly roles = input<string[] | Role[] | undefined>([], { alias: "appAnyRoles" });
  readonly granted = output<boolean>();
  ngOnInit() {
    const roles = this.roles();
    if (!roles || roles.length === 0) {
      console.log(`[appAnyRoles] no roles provided [${roles}]: grant access`);
      this.granted.emit(true);
      return;
    }
    const hasAccess = this._loginService.getLoggedUser().hasAnyRoles(roles as Role[]);
    console.log(`[appAnyRoles] has access for roles [${roles}]: ${hasAccess}`);
    this.granted.emit(hasAccess);
    //still usefull ?
    //if (!hasAccess) this._elementRef.nativeElement.style.display = "none";
  }
}

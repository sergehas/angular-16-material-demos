import { Directive, ElementRef, OnInit, inject, input, output } from "@angular/core";
import { LoginService, Role } from "@app/core/login/services/login.service";

@Directive({
  selector: "[appAllRoles]",
  standalone: true,
})
/**
 * Grants access only when the signed user owns all provided roles.
 *
 * Emits the authorization result through the `granted` output so host
 * components can react without relying on direct DOM mutations.
 */
export class AllRolesDirective implements OnInit {
  private readonly _elementRef = inject(ElementRef);
  private readonly _loginService = inject(LoginService);

  readonly roles = input<string[] | Role[] | undefined>([], { alias: "appAllRoles" });

  readonly granted = output<boolean>();

  /**
   * Evaluates access on init and emits the result.
   * Emits `true` when no roles are provided.
   */
  ngOnInit() {
    const roles = this.roles();
    if (!roles || roles.length === 0) {
      console.log(`[appAllRoles] no roles provided [${roles}]: grant access`);
      this.granted.emit(true);
      return;
    }
    const hasAccess = this._loginService.getLoggedUser().hasAllRoles(roles as Role[]);
    console.log(`[appAllRoles] has access for roles [${roles}]: ${hasAccess}`);
    this.granted.emit(hasAccess);
    //still usefull ?
    //if (!hasAccess) this._elementRef.nativeElement.style.display = "none";
  }
}

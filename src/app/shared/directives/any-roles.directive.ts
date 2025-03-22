import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, inject } from "@angular/core";
import { LoginService, Role } from "src/app/core/services/login.service";

@Directive({
  selector: "[appAnyRoles]",
  standalone: true,
})
export class AnyRolesDirective implements OnInit {
  private readonly _elementRef = inject(ElementRef);
  private readonly _loginService = inject(LoginService);

  @Input("appAnyRoles") roles: string[] | Role[] | undefined = [];
  @Output() granted: EventEmitter<boolean> = new EventEmitter();
  ngOnInit() {
    if (!this.roles || this.roles.length === 0) {
      console.log(`[appAnyRoles] no roles provided [${this.roles}]: grant access`);
      this.granted.emit(true);
      return;
    }
    const hasAccess = this._loginService.getLoggedUser().hasAnyRoles(this.roles as Role[]);
    console.log(`[appAnyRoles] has access for roles [${this.roles}]: ${hasAccess}`);
    this.granted.emit(hasAccess);
    //still usefull ?
    //if (!hasAccess) this._elementRef.nativeElement.style.display = "none";
  }
}

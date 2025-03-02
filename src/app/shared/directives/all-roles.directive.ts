import { Directive, ElementRef, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LoginService, Role } from "src/app/core/services/login.service";

@Directive({
  selector: "[appAllRoles]",
  standalone: true,
})
export class AnyRolesDirective implements OnInit {
  @Input("appAllRoles") roles: string[] | Role[] | undefined = [];
  @Output() granted: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private readonly _elementRef: ElementRef,
    private readonly _loginService: LoginService
  ) {}
  ngOnInit() {
    if (!this.roles || this.roles.length === 0) {
      console.log(`[appAllRoles] no roles provided [${this.roles}]: grant access`);
      this.granted.emit(true);
      return;
    }
    const hasAccess = this._loginService.getLoggedUser().hasAllRoles(this.roles as Role[]);
    console.log(`[appAllRoles] has access for roles [${this.roles}]: ${hasAccess}`);
    this.granted.emit(hasAccess);
    //still usefull ?
    //if (!hasAccess) this._elementRef.nativeElement.style.display = "none";
  }
}

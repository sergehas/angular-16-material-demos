import { Injectable } from "@angular/core";

export type Role = "ADMIN" | "AUTHOR" | "VIEWER" | "SPECTATOR" | "SUPER";

export class SignedUser {
  name: string | null = null;
  lastname: string | null = null;
  id: string | null = null;
  isLoggedIn = false;
  roles: Role[] = [];

  static from(
    name: string,
    lastname: string,
    id: string,
    isLoggedIn: boolean,
    roles: Role[]
  ): SignedUser {
    const self = new SignedUser();
    self.name = name;
    self.lastname = lastname;
    self.id = id;
    self.isLoggedIn = isLoggedIn;
    self.roles = [...roles];
    return self;
  }
  static clone(u: SignedUser): SignedUser {
    return SignedUser.from(u.name!, u.lastname!, u.id!, u.isLoggedIn, [
      ...u.roles,
    ]);
  }
  hasAnyRoles(roles: Role | Role[]): boolean {
    const r = [...roles] as Role[];
    return this.roles.some((role) => r.includes(role));
  }
  hasAllRoles(roles: Role | Role[]): boolean {
    const r = [...roles] as Role[];
    return r.every((role) => this.roles.includes(role));
  }
}

@Injectable({
  providedIn: "root",
})
/**
 * fake login serivce. Host the supposed logged in user
 */
export class LoginService {
  private readonly _user = new SignedUser();
  constructor() {
    this.login();
  }

  getLoggedUser(): SignedUser {
    return SignedUser.clone(this._user);
  }

  /**
   * fake login process
   */
  login(): void {
    this._user.isLoggedIn = true;
    this._user.name = "John";
    this._user.lastname = "DOE";
    this._user.id = "jdoe";
    this._user.roles = ["AUTHOR", "SPECTATOR"];
  }

  logout(): void {
    this._user.isLoggedIn = false;
    this._user.name = null;
    this._user.lastname = null;
    this._user.id = null;
    this._user.roles = [];
  }
}

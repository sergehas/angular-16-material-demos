import { Injectable } from '@angular/core';


export type Role = "ADMIN" | "AUTHOR" | "VIEWER" | "SPECTATOR" | "SUPER";

export class SignedUser {
  name: string | null = null;
  lastname: string | null = null;
  id: string | null = null;
  isLoggedIn = false;
  roles: Role[] = [];
}

@Injectable({
  providedIn: 'root'
})
/**
 * fake login serivce. Host the supposed logged in user
 */
export class LoginService {
  private _user = new SignedUser();
  constructor() {
    this.login();
  }

  getLoggedUser() {
    return { ...this._user };
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

import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Security } from "../utils/Security.util";

@Injectable()
export class AuthService implements CanActivate {

  constructor(private router: Router) {
  }
  canActivate() {
    const token = Security.getToken();
    if (!token) {
      this.router.navigate(['/'])
      return false;
    }

    return true;
  }
}

import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class LoginGuardService implements CanActivate {
  constructor(private route: Router, private authService: AuthService) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.route.navigateByUrl("dashboard");
      return false;
    }
    return true;
  }
}

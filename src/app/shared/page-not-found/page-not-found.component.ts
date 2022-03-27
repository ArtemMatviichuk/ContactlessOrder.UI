import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent {
  constructor(private readonly router: Router, private authService: AuthService) {}

  /**
   * Back to dashboard
   */
  public navigateToDashboard() {
    this.router.navigate([this.authService.isCompany() ? '/business' : '/dashboard']);
  }
}

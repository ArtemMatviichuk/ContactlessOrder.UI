import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SupportGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });

      return false;
    }

    if (!this.authService.isSupport()) {
      if (this.authService.isCatering) {
        this.router.navigate(['/catering']);

        return false;
      } else if (this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
  
        return false;
      } else if (this.authService.isCompany()) {
        this.router.navigate(['/business']);
  
        return false;
      } else {
        this.router.navigate(['/dashboard']);

        return false;
      }
    }

    return true;
  }
}

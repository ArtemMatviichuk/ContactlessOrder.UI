import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SharedService } from '../shared/services/shared.service';
import { StorageService } from '../shared/services/storage.service';

@Injectable()
export class LoginSharedService {
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private storageService: StorageService
  ) {}

  public handleToken(token, returnUrl) {
    if (token) {
      this.storageService.setString('token', token);
      this.storageService.setString(
        'email',
        new JwtHelperService().decodeToken(token).Email
      );

      this.router.navigateByUrl(returnUrl);
    } else {
      this.sharedService.showRequestError("Not valid token");
    }
  }
}

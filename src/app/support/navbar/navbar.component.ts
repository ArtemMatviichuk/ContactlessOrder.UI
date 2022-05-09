import { Component, OnDestroy, OnInit } from '@angular/core';
import { LOGO_IMAGE } from 'src/app/shared/constants/images';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class SupportNavbarComponent implements OnInit, OnDestroy {
  public logoPath = LOGO_IMAGE;

  constructor(private authService: AuthService) {}

  public async ngOnInit() {}

  public async ngOnDestroy() {}

  public logout() {
    this.authService.logout();
  }
}

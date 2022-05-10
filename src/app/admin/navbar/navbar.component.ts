import { Component, OnDestroy, OnInit } from '@angular/core';
import { LOGO_IMAGE } from 'src/app/shared/constants/images';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AdminSharedService } from '../apps/admin/admin-shared.service';
import { PAGES } from '../apps/admin/constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class AdminNavbarComponent implements OnInit, OnDestroy {
  public logoPath = LOGO_IMAGE;

  public pages = PAGES;

  constructor(
    public adminSharedService: AdminSharedService,
    private authService: AuthService
  ) {}

  public async ngOnInit() {}

  public async ngOnDestroy() {}

  public logout() {
    this.authService.logout();
  }
}

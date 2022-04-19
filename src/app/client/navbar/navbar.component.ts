import { Component, OnDestroy, OnInit } from '@angular/core';
import { LOGO_IMAGE } from 'src/app/shared/constants/images';

import { AuthService } from 'src/app/shared/services/auth.service';
import { ClientOrderNotificationService } from '../client/client-order-notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class ClientNavbarComponent implements OnInit, OnDestroy {
  public logoPath = LOGO_IMAGE;

  constructor(
    private authService: AuthService,
    private notificationService: ClientOrderNotificationService
  ) {}

  public async ngOnInit() {
    await this.notificationService.connect();
  }

  public async ngOnDestroy() {
    await this.notificationService.disconnect();
  }

  public logout() {
    this.authService.logout();
  }
}

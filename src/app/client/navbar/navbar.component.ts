import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { LOGO_IMAGE } from 'src/app/shared/constants/images';
import { cloneDeep } from "lodash-es";
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClientOrderNotificationService } from '../client/client-order-notification.service';
import { ClientSharedService } from '../client/client-shared.service';
import { OrderReadyComponent } from './order-ready/order-ready.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class ClientNavbarComponent implements OnInit, OnDestroy {
  public logoPath = LOGO_IMAGE;

  constructor(
    private authService: AuthService,
    private clientSharedService: ClientSharedService,
    private notificationService: ClientOrderNotificationService,
    private toastrService: ToastrService
  ) {}

  public async ngOnInit() {
    await this.notificationService.connect();
    this.subscribeToChanges();
  }

  public async ngOnDestroy() {
    await this.notificationService.disconnect();
  }

  public logout() {
    this.authService.logout();
  }

  private subscribeToChanges() {
    this.notificationService
      .onOrderReady()
      .subscribe((number) => this.showReadyComponent(number));
  }

  private showReadyComponent(number) {
    this.clientSharedService.readyOrders.push(number);

    const opt: GlobalConfig = cloneDeep(this.toastrService.toastrConfig);
    opt.toastComponent = OrderReadyComponent;
    opt.timeOut = 0;
    opt.extendedTimeOut = 0;
    opt.toastClass = "";
    opt.tapToDismiss = false;

    this.toastrService.show(null, null, opt);
  }
}

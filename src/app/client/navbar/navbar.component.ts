import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LOGO_IMAGE } from 'src/app/shared/constants/images';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientNotificationService } from '../client/client-notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class ClientNavbarComponent implements OnInit, OnDestroy {
  public logoPath = LOGO_IMAGE;
  public collapsed = false;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private notificationService: ClientNotificationService,
    private toastrService: ToastrService,
  ) {}

  public async ngOnInit() {
    this.toggleCollapsed();
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
    this.notificationService.onOrderReady().subscribe((number) => {
      this.toastrService.success(number, 'Нове замовлення');
      this.sharedService.playNotificationSound();
    });
  }
  
  @HostListener("window:resize", ["$event"])
  private toggleCollapsed(): void {
    this.collapsed = window.innerWidth <= 768;
  }
}

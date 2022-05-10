import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminNotificationService } from '../admin-notification.service';
import { AdminSharedService } from '../admin-shared.service';
import { PAGE_VALUES } from '../constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  public pageValues = PAGE_VALUES;

  constructor(
    public adminSharedService: AdminSharedService,
    private notificationService: AdminNotificationService,
  ) {}

  public async ngOnInit() {
    await this.notificationService.connect();
  }

  public async ngOnDestroy() {
    await this.notificationService.disconnect();
  }
}

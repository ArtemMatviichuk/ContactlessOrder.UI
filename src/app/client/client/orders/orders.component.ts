import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { ORDER_STATUS_VALUES } from 'src/app/shared/constants/values';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientNotificationService } from '../client-notification.service';
import { ClientSharedService } from '../client-shared.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  public orders = [];
  public orderStatusValues = ORDER_STATUS_VALUES;

  private onDestroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private clientService: ClientService,
    private clientSharedService: ClientSharedService,
    private notificationService: ClientNotificationService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    await this.getOrders();

    this.subscribeToChanges();

    this.cdr.markForCheck();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public getPositionLabel(position) {
    return `${position.optionName} ${
      position.modifications.length === 0
        ? ''
        : `+ ${position.modifications.map((e) => e.name).join(' + ')}`
    } x ${position.quantity} шт.`;
  }

  public getPositionImage(id) {
    return id
      ? this.clientService.getMenuItemPictureUrl(id)
      : PLACEHOLDER_IMAGE;
  }

  public getDateTime(value) {
    return this.sharedService.getDateTimeString(value);
  }

  public toPayment(orderId) {
    this.clientSharedService.openPaymentComponent(orderId);
  }

  private async getOrders() {
    try {
      this.orders = await this.clientService.getOrders();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private subscribeToChanges() {
    this.notificationService
      .onOrderUpdated()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        console.log(value);
        const index = this.orders.findIndex((e) => e.id === value.id);
        this.orders.splice(index, 1, value);

        this.cdr.detectChanges();
      });
  }
}

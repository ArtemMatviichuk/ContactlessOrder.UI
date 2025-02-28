import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CateringPositionComponent } from 'src/app/shared/catering-position/catering-position.component';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { ORDER_STATUS_VALUES } from 'src/app/shared/constants/values';
import { DialogTextComponent } from 'src/app/shared/dialog-text/dialog-text.component';
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
    private toastr: ToastrService,
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

  public async rejectOrder(id) {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви дійсно хочете ВІДМІНИТИ замовлення?'
    );

    if (result === 'ok') {
      try {
        await this.clientService.rejectOrder(id);
      } catch (error) {
        this.sharedService.showRequestError(error);
      }
    }
  }

  public async completeOrder(id) {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви підтверджуєте отримання замовлення?'
    );

    if (result === 'ok') {
      try {
        await this.clientService.completeOrder(id);
      } catch (error) {
        this.sharedService.showRequestError(error);
      }
    }
  }

  public async viewCateringPosition(orderId) {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.data = {};

    try {
      config.data.catering = await this.clientService.getCatering(orderId);
    } catch (error) {
      this.sharedService.showRequestError(error);
      return;
    }

    this.dialog.open(CateringPositionComponent, config);
  }

  public async complain(orderId) {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.data = { placeholder: 'Коментар (мінімум 20 символів)', rows: 10 };

    this.dialog
      .open(DialogTextComponent, config)
      .afterClosed()
      .subscribe(async (result) => {
        const res = await this.sharedService.openConfirmActionDialog("Ви дійсно хочете поскаржитися на заклад?");
        if (res !== "ok") {
          return;
        }

        if (result?.success) {
          try {
            await this.clientService.complainOrder(orderId, result.value);
            this.toastr.success("Скарга прийнята");
          } catch (error) {
            this.sharedService.showRequestError(error);
          }
        }
      });
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
        const index = this.orders.findIndex((e) => e.id === value.id);
        this.orders.splice(index, 1, value);

        this.cdr.detectChanges();
      });
  }
}

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientService } from './client.service';
import { PaymentComponent } from './payment/payment.component';

@Injectable()
export class ClientSharedService {
  public readyOrders = [];
  
  constructor(
    private dialog: MatDialog,
    private clientService: ClientService,
    private sharedService: SharedService
  ) {}

  public openPaymentComponent(orderId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { orderId };

    this.dialog
      .open(PaymentComponent, dialogConfig)
      .afterClosed()
      .subscribe(async (result) => {
        if (result?.success) {
          try {
            await this.clientService.orderPaid({
              id: orderId,
              name: result.paymentNumber,
            });
          } catch (error) {
            this.sharedService.showRequestError(error);
          }
        }
      });
  }
  
  public getModificationsPrice(item) {
    return item.modifications
      .filter((e) => item.selectedModificationIds?.includes(e.id))
      .map((e) => e.price)
      .reduce((acc, cur) => acc + cur, 0);
  }
}

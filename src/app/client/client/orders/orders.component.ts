import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { ORDER_STATUS_VALUES } from 'src/app/shared/constants/values';
import { DialogTextComponent } from 'src/app/shared/dialog-text/dialog-text.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientSharedService } from '../client-shared.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public orders = [];
  public orderStatusValues = ORDER_STATUS_VALUES;

  constructor(
    private dialog: MatDialog,
    private clientService: ClientService,
    private clientSharedService: ClientSharedService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    await this.getOrders();

    this.cdr.markForCheck();
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
}

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImageGalleryComponent } from 'src/app/shared/image-gallery/image-gallery.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CartService } from '../../cart-service';
import { ClientSharedService } from '../../client-shared.service';
import { ClientService } from '../../client.service';
import { PAYMENT_METHODS } from '../../constants';
import { CreateOrderComponent } from '../create-order/create-order.component';

@Component({
  selector: 'app-cart-catering',
  templateUrl: './cart-catering.component.html',
  styleUrls: ['./cart-catering.component.scss'],
})
export class CartCateringComponent implements OnInit {
  @Input() options: any[] = [];
  @Output() onPaymentDone = new EventEmitter<void>();
  @Output() onAllDeleted = new EventEmitter<void>();

  public selectedOption = null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private clientService: ClientService,
    private clientSharedService: ClientSharedService,
    private cartService: CartService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit() {}

  public changeQty(item, value) {
    const index = this.options.findIndex(
      (e) =>
        e.id === item.id &&
        e.cateringId == item.cateringId &&
        e.selectedModificationIds?.toString() ===
          item.selectedModificationIds?.toString()
    );

    if (value > 0 || this.options[index].qty > 1) {
      this.options[index].qty += value;

      this.cartService.setItem({
        id: item.id,
        cateringId: this.options[index].cateringId,
        qty: this.options[index].qty,
        modificationIds: this.options[index].selectedModificationIds,
      });
    }
  }

  public async removeCartItem(item) {
    const result = await this.sharedService.openConfirmDeleteDialog();

    if (result === 'delete') {
      if (this.options.length > 1) {
        this.options = this.options.filter(
          (e) =>
            e.id !== item.id ||
            e.selectedModificationIds !== item.selectedModificationIds
        );
      } else {
        this.options = [];
        this.onAllDeleted.next();
      }

      this.cartService.removeItem(
        item.id,
        item.cateringId,
        item.selectedModificationIds
      );
      this.cdr.markForCheck();
    }
  }

  public getTotalPrice() {
    return this.options
      .map((o) => {
        const modificationsPrice =
          this.clientSharedService.getModificationsPrice(o);

        return (o.price + modificationsPrice) * o.qty;
      })
      .reduce((pr, c) => pr + c);
  }

  public getItemPriceString(item) {
    if (item.selectedModificationIds?.length > 0) {
      const modificationsPrice =
        this.clientSharedService.getModificationsPrice(item);

      return `(${item.price} + ${item.selectedModificationIds
        .map((m) => item.modifications.find((e) => e.id == m).price)
        .join('+ ')}) * ${item.qty} = ${
        (item.price + modificationsPrice) * item.qty
      }`;
    }

    return `${item.price} x ${item.qty} = ${item.price * item.qty}`;
  }

  public toPayment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    this.dialog
      .open(CreateOrderComponent, dialogConfig)
      .afterClosed()
      .subscribe(async (result) => {
        if (result?.success) {
          try {
            const orderId = await this.clientService.createOrder({
              ...result.value,
              positions: this.options.map((e) => ({
                optionId: e.cateringOptionId,
                quantity: e.qty,
                modificationIds: e.selectedModificationIds,
              })),
            });

            this.options.forEach((e) =>
              this.cartService.removeItem(e.id, e.cateringId, e.selectedModificationIds)
            );
            this.onAllDeleted.emit();

            if (result.value.paymentMethodValue !== PAYMENT_METHODS.cash) {
              this.clientSharedService.openPaymentComponent(orderId);
            }

            this.router.navigate(['/orders']);
          } catch (error) {
            this.sharedService.showRequestError(error);
            return;
          }
        }
      });
  }

  public async openPictureGallery(id) {
    const pictures = await this.getPictures(id);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '900px';
    dialogConfig.data = { pictures };

    this.dialog.open(ImageGalleryComponent, dialogConfig);
  }

  private async getPictures(id) {
    try {
      const pictures = await this.clientService.getOptionPictures(id);

      return pictures.map((i) => ({
        fileName: i.fileName,
        url: this.clientService.getMenuItemPictureUrl(i.id),
        id: i.id,
      }));
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

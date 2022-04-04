import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogTextComponent } from 'src/app/shared/dialog-text/dialog-text.component';
import { ImageGalleryComponent } from 'src/app/shared/image-gallery/image-gallery.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CartService } from '../../cart-service';
import { ClientSharedService } from '../../client-shared.service';
import { ClientService } from '../../client.service';
import { PaymentComponent } from '../../payment/payment.component';

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
    private clientService: ClientService,
    private clientSharedService: ClientSharedService,
    private cartService: CartService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit() {}

  public changeQty(id, value) {
    const index = this.options.findIndex((e) => e.id === id);

    if (value > 0 || this.options[index].qty > 1) {
      this.options[index].qty += value;

      this.cartService.setItem(id, this.options[index].qty);
    }
  }

  public async removeCartItem(id) {
    const result = await this.sharedService.openConfirmDeleteDialog();

    if (result === 'delete') {
      if (this.options.length > 1) {
        this.options = this.options.filter((e) => e.id !== id);
      } else {
        this.options = [];
        this.onAllDeleted.next();
      }

      this.cartService.removeItem(id);
      this.cdr.markForCheck();
    }
  }

  public getTotalPrice() {
    return this.options.map((e) => e.price * e.qty).reduce((pr, c) => pr + c);
  }

  public toPayment() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';

    this.dialog
      .open(DialogTextComponent, dialogConfig)
      .afterClosed()
      .subscribe(async (result) => {
        if (result?.success) {
          try {
            const orderId = await this.clientService.createOrder({
              comment: result.value,
              positions: this.options.map((e) => ({
                optionId: e.cateringOptionId,
                quantity: e.qty,
              })),
            });

            this.options.forEach(e => this.cartService.removeItem(e.id));
            this.onAllDeleted.emit();

            this.clientSharedService.openPaymentComponent(orderId);
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

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CartService } from '../cart-service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public cartItems = [];

  constructor(
    private cartService: CartService,
    private clientService: ClientService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.getData();
  }

  public removeitems(i) {
    this.cartItems.splice(i, 1);
    this.cdr.markForCheck();
  }

  private async getData() {
    try {
      const cartItems = this.cartService.getCart();
      const orderItems = await this.clientService.getOptions(
        cartItems.map((e) => ({
          id: e.id,
          cateringId: e.cateringId,
        }))
      );

      const resultItems = [];

      for (let i = 0; i < cartItems.length; i++) {
        const item = orderItems.find(
          (e) =>
            e.id == cartItems[i].id && e.cateringId == cartItems[i].cateringId
        );
        if (item) {
          resultItems.push({
            ...item,
            qty: cartItems[i].qty,
            selectedModificationIds: cartItems[i].modificationIds,
            firstPictureUrl: item.firstPictureId
              ? this.clientService.getMenuItemPictureUrl(item.firstPictureId)
              : PLACEHOLDER_IMAGE,
          });
        }
      }

      this.cartItems = Object.values(
        resultItems.reduce((rv, x) => {
          (rv[x.cateringId] = rv[x.cateringId] || []).push(x);
          return rv;
        }, {})
      );

      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

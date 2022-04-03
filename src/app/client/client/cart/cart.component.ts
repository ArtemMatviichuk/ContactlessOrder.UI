import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
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
    const cartItems = this.cartService.getCart();
    const orderItems = await this.clientService.getOptions(
      cartItems.map((e) => e.id)
    );

    orderItems.forEach((e) => {
      e.qty = cartItems.find((i) => i.id === e.id).qty;
      e.firstPictureUrl = e.firstPictureId
        ? this.clientService.getMenuItemPictureUrl(e.firstPictureId)
        : PLACEHOLDER_IMAGE;
    });

    this.cartItems = Object.values(
      orderItems.reduce((rv, x) => {
        (rv[x.cateringId] = rv[x.cateringId] || []).push(x);
        return rv;
      }, {})
    );

    this.cdr.markForCheck();
  }
}

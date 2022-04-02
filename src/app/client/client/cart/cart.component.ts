import { Component, OnInit } from '@angular/core';
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
    private clientService: ClientService
  ) {}

  public ngOnInit(): void {
    this.getData();
  }

  private getData() {
    const cartItems = this.cartService.getCart();
    const orderItems = this.clientService.getOptions(cartItems);
  }
}

import { Injectable } from '@angular/core';

@Injectable()
export class CartService {
  private readonly cartName = 'Client.Cart';

  public addItem(item) {
    let cartString = localStorage.getItem(this.cartName);
    let cart = null;

    if (cartString) {
      cart = JSON.parse(cartString);
      const index = cart.findIndex((e) => e.id === item.id);

      if (index !== -1) {
        cart[index].qty += item.qty;
      } else {
        cart.push(item);
      }
    } else {
      cart = [item];
    }

    localStorage.setItem(this.cartName, JSON.stringify(cart));
  }

  public removeItem(id) {
    let cartString = localStorage.getItem(this.cartName);

    if (cartString) {
      let cart = JSON.parse(cartString);
      cart = cart.filter((e) => e.id !== id);

      localStorage.setItem(this.cartName, JSON.stringify(cart));
    }
  }
  
  public getCart(): any[] {
    let cartString = localStorage.getItem(this.cartName);

    if (cartString) {
      return JSON.parse(cartString);
    }

    return [];
  }
}

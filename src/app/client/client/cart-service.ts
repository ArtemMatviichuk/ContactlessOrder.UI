import { Injectable } from '@angular/core';

@Injectable()
export class CartService {
  private readonly cartName = 'Client.Cart';

  public addItem(item) {
    let cartString = localStorage.getItem(this.cartName);
    let cart = null;

    if (cartString) {
      cart = JSON.parse(cartString);
      const index = cart.findIndex((e) => this.isEqual(e, item));

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

  public setItem(item) {
    let cartString = localStorage.getItem(this.cartName);
    let cart = null;

    if (cartString) {
      cart = JSON.parse(cartString);
      const index = cart.findIndex((e) => this.isEqual(e, item));

      if (index !== -1) {
        cart[index].qty = item.qty;
      } else {
        cart.push(item);
      }
    } else {
      cart = [item];
    }

    localStorage.setItem(this.cartName, JSON.stringify(cart));
  }

  public removeItem(id, cateringId, modificationIds) {
    let cartString = localStorage.getItem(this.cartName);

    if (cartString) {
      let cart = JSON.parse(cartString);

      cart = cart.filter((e) => !this.isEqual(e, {id, cateringId, modificationIds}));

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

  private isEqual(item1, item2) {
    item1.modificationIds = item1.modificationIds ? item1.modificationIds : [];
    item2.modificationIds = item2.modificationIds ? item2.modificationIds : [];

    return (
      item1.id === item2.id &&
      item1.cateringId === item2.cateringId &&
      item1.modificationIds.sort().toString() ==
        item2.modificationIds.sort().toString()
    );
  }
}

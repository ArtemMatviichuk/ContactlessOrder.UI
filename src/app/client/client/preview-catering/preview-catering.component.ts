import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CartService } from '../cart-service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-preview-catering',
  templateUrl: './preview-catering.component.html',
  styleUrls: ['./preview-catering.component.scss'],
})
export class PreviewCateringComponent implements OnChanges {
  @Input() catering: any;

  public menu = [];

  constructor(
    private clientService: ClientService,
    private cartService: CartService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    this.getMenu();
  }

  public getTime() {
    const openTime = this.catering.openTime;
    const closeTime = this.catering.closeTime;
    return `${openTime.hour.toString().padStart(2, '0')}:${openTime.minute
      .toString()
      .padStart(2, '0')}-${closeTime.hour
      .toString()
      .padStart(2, '0')}:${closeTime.minute.toString().padStart(2, '0')}`;
  }

  public biggerOption(index) {
    const selectedIndex = this.menu[index].options.findIndex(
      (o) => o.id === this.menu[index].selectedOptionId
    );

    this.updateOptionButtonsState(index, selectedIndex + 1);

    this.cdr.markForCheck();
  }

  public smallerOption(index) {
    const selectedIndex = this.menu[index].options.findIndex(
      (o) => o.id === this.menu[index].selectedOptionId
    );

    this.updateOptionButtonsState(index, selectedIndex - 1);

    this.cdr.markForCheck();
  }

  public subtractQty(index) {
    this.menu[index].qty--;
    this.updateTotalPrice(index);
  }

  public addQty(index) {
    this.menu[index].qty++;
    this.updateTotalPrice(index);
  }

  public addToCart(item) {
    this.cartService.addItem({
      id: item.selectedOptionId,
      qty: item.qty,
      cateringId: this.catering.id,
    });

    this.setMenuItemDefaultState(item);
  }

  private async getMenu() {
    try {
      const menu = await this.clientService.getMenu(this.catering.id);
      menu.forEach((e) => {
        e.firstPictureUrl = e.firstPictureId
          ? this.clientService.getMenuItemPictureUrl(e.firstPictureId)
          : PLACEHOLDER_IMAGE;

        this.setMenuItemDefaultState(e);
      });

      this.menu = menu;
      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private setMenuItemDefaultState(item) {
    item.selectedOptionId = item.options[0].id;
    item.disabled = !item.options[0].available;
    item.totalPrice = item.options[0].price;
    item.disableSelectSmallerOption = true;
    item.disableSelectBiggerOption = item.options.length === 1;
    item.qty = 1;
  }

  private updateOptionButtonsState(index, newIndex) {
    this.menu[index].disabled = !this.menu[index].options[newIndex].available;
    this.menu[index].selectedOptionId = this.menu[index].options[newIndex].id;

    this.menu[index].disableSelectBiggerOption =
      this.menu[index].options.findIndex(
        (o) => o.id === this.menu[index].selectedOptionId
      ) ===
      this.menu[index].options.length - 1;

    this.menu[index].disableSelectSmallerOption =
      this.menu[index].options.findIndex(
        (o) => o.id === this.menu[index].selectedOptionId
      ) === 0;

    this.updateTotalPrice(index);
  }

  private updateTotalPrice(index) {
    this.menu[index].totalPrice =
      this.menu[index].qty *
      this.menu[index].options.find(
        (o) => o.id === this.menu[index].selectedOptionId
      ).price;
  }
}

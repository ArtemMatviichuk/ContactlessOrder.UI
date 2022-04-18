import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  public commentControl = new FormControl(null);
  public totalPrice = null;

  public paymentRequest: google.payments.api.PaymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['VISA', 'MASTERCARD'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: 'example',
            gatewayMerchantId: 'exampleGatewayMerchantId',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: 'BCR2DN4T6CF4PIAZ',
      merchantName: 'Contactless Order',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: '0',
      currencyCode: 'UAH',
      countryCode: 'UA',
    },
  };

  constructor(
    private clientService: ClientService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<PaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  public ngOnInit(): void {
    this.getTotalPrice();
  }

  public async onLoadPaymentData(event) {
    try {
      await this.clientService.orderPaid({
        id: this.dialogData.orderId,
        name: event.detail.paymentMethodData.tokenizationData.token,
      });

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
      this.sharedService.showTemplate(`
<p>№ розрахунку: ${event.detail.paymentMethodData.tokenizationData.token}</p>
<p>Зверніться в службу підтримки</p>`)
    }
  }

  private async getTotalPrice() {
    try {
      this.totalPrice = await this.clientService.getTotalPrice(
        this.dialogData.orderId
      );
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartService } from './cart-service';
import { CartComponent } from './cart/cart.component';
import { ClientService } from './client.service';
import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PreviewCateringComponent } from './preview-catering/preview-catering.component';
import { CartCateringComponent } from './cart/cart-catering/cart-catering.component';
import { AgGridModule } from 'ag-grid-angular';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { PaymentComponent } from './cart/payment/payment.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PreviewCateringComponent,
    CartComponent,
    CartCateringComponent,
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    AgGridModule,
    GooglePayButtonModule,
  ],
  providers: [ClientService, CartService],
})
export class ClientModule {}

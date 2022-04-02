import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CartService } from './cart-service';
import { CartComponent } from './cart/cart.component';
import { ClientService } from './client.service';
import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PreviewCateringComponent } from './preview-catering/preview-catering.component';

@NgModule({
  declarations: [DashboardComponent, PreviewCateringComponent, CartComponent],
  imports: [CommonModule, ClientRoutingModule, SharedModule],
  providers: [ClientService, CartService],
})
export class ClientModule {}

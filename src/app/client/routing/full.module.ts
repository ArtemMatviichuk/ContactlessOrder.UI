import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ClientOrderNotificationService } from '../client/client-order-notification.service';
import { ClientSharedService } from '../client/client-shared.service';
import { ClientService } from '../client/client.service';
import { ClientNavbarComponent } from '../navbar/navbar.component';
import { OrderReadyComponent } from '../navbar/order-ready/order-ready.component';
import { FullRoutingModule } from './full-routing.module';
import { FullComponent } from './full.component';

@NgModule({
  declarations: [FullComponent, ClientNavbarComponent, OrderReadyComponent],
  imports: [CommonModule, FullRoutingModule, SharedModule],
  providers: [ClientOrderNotificationService, ClientSharedService, ClientService],
})
export class FullModule {}

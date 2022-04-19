import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ClientOrderNotificationService } from '../client/client-order-notification.service';
import { ClientNavbarComponent } from '../navbar/navbar.component';
import { FullRoutingModule } from './full-routing.module';
import { FullComponent } from './full.component';

@NgModule({
  declarations: [FullComponent, ClientNavbarComponent],
  imports: [CommonModule, FullRoutingModule, SharedModule],
  providers: [ClientOrderNotificationService],
})
export class FullModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ClientNotificationService } from '../client/client-notification.service';
import { ClientSharedService } from '../client/client-shared.service';
import { ClientService } from '../client/client.service';
import { ClientNavbarComponent } from '../navbar/navbar.component';
import { FullRoutingModule } from './full-routing.module';
import { FullComponent } from './full.component';

@NgModule({
  declarations: [FullComponent, ClientNavbarComponent],
  imports: [CommonModule, FullRoutingModule, SharedModule],
  providers: [ClientNotificationService, ClientSharedService, ClientService],
})
export class FullModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CateringNotificationService } from '../apps/catering/catering-notification.service';
import { CateringNavbarComponent } from '../navbar/navbar.component';
import { FullRoutingModule } from './full-routing.module';
import { FullComponent } from './full.component';

@NgModule({
  declarations: [FullComponent, CateringNavbarComponent],
  imports: [CommonModule, FullRoutingModule, SharedModule],
  providers: [CateringNotificationService],
})
export class FullModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { SupportNotificationService } from '../apps/support/support-notification.service';
import { SupportNavbarComponent } from '../navbar/navbar.component';
import { FullRoutingModule } from './full-routing.module';
import { FullComponent } from './full.component';

@NgModule({
  declarations: [FullComponent, SupportNavbarComponent],
  imports: [CommonModule, FullRoutingModule, SharedModule],
  providers: [SupportNotificationService]
})
export class FullModule {}

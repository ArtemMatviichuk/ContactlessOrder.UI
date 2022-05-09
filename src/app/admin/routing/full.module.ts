import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AdminNotificationService } from '../apps/admin/admin-notification.service';
import { AdminNavbarComponent } from '../navbar/navbar.component';
import { FullRoutingModule } from './full-routing.module';
import { FullComponent } from './full.component';

@NgModule({
  declarations: [FullComponent, AdminNavbarComponent],
  imports: [CommonModule, FullRoutingModule, SharedModule],
  providers: [AdminNotificationService],
})
export class FullModule {}

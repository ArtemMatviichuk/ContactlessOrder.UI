import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminService } from './admin.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { PreviewCompanyComponent } from './admin/preview-company/preview-company.component';

@NgModule({
  declarations: [
    AdminComponent,
    PreviewCompanyComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    AgGridModule,
    BlockUIModule,
    NgbModule,
  ],
  providers: [AdminService],
})
export class AdminModule {}

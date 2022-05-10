import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminService } from './admin.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { CompaniesComponent } from './admin/companies/companies.component';
import { PreviewCompanyComponent } from './admin/companies/preview-company/preview-company.component';
import { UsersComponent } from './admin/users/users.component';
import { TeamComponent } from './admin/team/team.component';
import { ManageUserComponent } from './admin/team/manage-user/manage-user.component';
import { NewUserComponent } from './admin/team/new-user/new-user.component';

@NgModule({
  declarations: [
    AdminComponent,
    PreviewCompanyComponent,
    CompaniesComponent,
    UsersComponent,
    TeamComponent,
    ManageUserComponent,
    NewUserComponent,
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

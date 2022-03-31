import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanySettingsRoutingModule } from './company-settings-routing.module';
import { CompanySettingsService } from './company-settings.service';
import { CateringsComponent } from './company-settings/caterings/caterings.component';
import { NewCateringComponent } from './company-settings/caterings/new-catering/new-catering.component';
import { CompanySettingsComponent } from './company-settings/company-settings.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageCateringComponent } from './company-settings/caterings/manage-catering/manage-catering.component';
import { MenuComponent } from './company-settings/menu/menu.component';
import { NewMenuItemComponent } from './company-settings/menu/new-menu-item/new-menu-item.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    CompanySettingsComponent,
    CateringsComponent,
    NewCateringComponent,
    ManageCateringComponent,
    MenuComponent,
    NewMenuItemComponent,
  ],
  imports: [
    CommonModule,
    CompanySettingsRoutingModule,
    SharedModule,
    AgGridModule,
    BlockUIModule,
    NgbModule,
    NgSelectModule,
  ],
  providers: [CompanySettingsService],
})
export class CompanySettingsModule {}

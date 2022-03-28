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

@NgModule({
  declarations: [
    CompanySettingsComponent,
    CateringsComponent,
    NewCateringComponent,
  ],
  imports: [
    CommonModule,
    CompanySettingsRoutingModule,
    SharedModule,
    AgGridModule,
    BlockUIModule,
    NgbModule,
  ],
  providers: [CompanySettingsService],
})
export class CompanySettingsModule {}

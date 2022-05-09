import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SupportService } from './support.service';
import { SupportComponent } from './support/support.component';
import { SupportRoutingModule } from './support-routing.module';

@NgModule({
  declarations: [
    SupportComponent,
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    SharedModule,
    AgGridModule,
    BlockUIModule,
    NgbModule,
  ],
  providers: [SupportService],
})
export class SupportModule {}

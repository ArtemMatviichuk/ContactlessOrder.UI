import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { BlockUIModule } from 'ng-block-ui';
import { SharedModule } from 'src/app/shared/shared.module';
import { CateringService } from './catering.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CateringComponent } from './catering/catering.component';
import { CateringRoutingModule } from './catering-routing.module';

@NgModule({
  declarations: [
    CateringComponent,
  ],
  imports: [
    CommonModule,
    CateringRoutingModule,
    SharedModule,
    AgGridModule,
    BlockUIModule,
    NgbModule,
  ],
  providers: [CateringService],
})
export class CateringModule {}

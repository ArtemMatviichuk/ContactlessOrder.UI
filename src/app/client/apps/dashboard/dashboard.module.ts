import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { ClientService } from "./client.service";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PreviewCateringComponent } from "./preview-catering/preview-catering.component";

@NgModule({
  declarations: [DashboardComponent, PreviewCateringComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
  providers: [ClientService]
})
export class DashboardModule {}

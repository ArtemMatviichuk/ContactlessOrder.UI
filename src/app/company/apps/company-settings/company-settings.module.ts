import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CompanySettingsRoutingModule } from "./company-settings-routing.module";
import { CompanySettingsService } from "./company-settings.service";
import { CompanySettingsComponent } from "./company-settings/company-settings.component";

@NgModule({
  declarations: [CompanySettingsComponent],
  imports: [CommonModule, CompanySettingsRoutingModule, SharedModule],
  providers: [CompanySettingsService]
})
export class CompanySettingsModule {}

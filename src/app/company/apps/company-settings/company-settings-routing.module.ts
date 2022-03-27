import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CompanySettingsComponent } from "./company-settings/company-settings.component";

const routes: Routes = [
  {
    path: "",
    component: CompanySettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanySettingsRoutingModule {}

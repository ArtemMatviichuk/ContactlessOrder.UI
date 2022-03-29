import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CateringComponent } from "./catering/catering.component";

const routes: Routes = [
  {
    path: "",
    component: CateringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CateringRoutingModule {}

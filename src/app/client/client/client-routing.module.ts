import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { APP_ROUTES } from "../app-routes";
import { CartComponent } from "./cart/cart.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: APP_ROUTES.DASHBOARD,
    component: DashboardComponent,
  },
  {
    path: APP_ROUTES.CART,
    component: CartComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}

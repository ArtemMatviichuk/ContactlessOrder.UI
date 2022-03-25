import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { LoginGuardService } from "../shared/services/login-guard.sevice";
import { RegisterComponent } from "./register/register.component";

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [LoginGuardService] },
  { path: "login", component: LoginComponent, canActivate: [LoginGuardService] },
  { path: "register", component: RegisterComponent, canActivate: [LoginGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}

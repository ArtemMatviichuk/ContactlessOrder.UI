import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { LoginGuardService } from "../shared/services/login-guard.sevice";
import { RegisterComponent } from "./register/register.component";
import { ConfirmEmailComponent } from "./confirm-email/confirm-email.component";

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate: [LoginGuardService] },
  { path: "login", component: LoginComponent, canActivate: [LoginGuardService] },
  { path: "register", component: RegisterComponent, canActivate: [LoginGuardService] },
  { path: "confirm-email", component: ConfirmEmailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}

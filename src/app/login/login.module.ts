import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LoginSharedService } from './login-shared.service';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    RegisterCompanyComponent,
  ],
  imports: [CommonModule, LoginRoutingModule, SharedModule],
  providers: [LoginSharedService],
})
export class LoginModule {}

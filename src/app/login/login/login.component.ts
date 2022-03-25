import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;

  private returnUrl: string;

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private storageService: StorageService
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.sharedService.validateFormFields(this.loginForm);

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  async login() {
    try {
      const form = this.loginForm.value;
      const data = await this.authService.login(form.email, form.password);

      this.handleToken(data);
    } catch (err) {
      this.sharedService.showRequestError(err.error);
    }
  }

  private handleToken(data) {
    if (data.token) {
      this.storageService.setString('token', data.token);
      this.storageService.setString(
        'email',
        new JwtHelperService().decodeToken(data.token).Email
      );

      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.sharedService.showRequestError(data);
    }
  }
}

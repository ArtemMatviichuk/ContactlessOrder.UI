import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { LoginSharedService } from '../login-shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @ViewChild('container') container: ElementRef<HTMLDivElement>;

  public loginForm: FormGroup;
  public isOauthLogin = false;

  private returnUrl: string;
  private externalUser: SocialUser;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService,
    private socialAuthService: SocialAuthService,
    private loginSharedService: LoginSharedService,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      var data = null;

      if (this.isOauthLogin) {
        const sendData = {
          provider: this.externalUser.provider,
          idToken: this.externalUser.idToken,
          phoneNumber: this.loginForm.controls.phoneNumber.value,
        };

        data = await this.authService.googleLogin(sendData);
      } else {
        const formValue = this.loginForm.value;
        data = await this.authService.login(
          formValue.email,
          formValue.password
        );
      }

      this.loginSharedService.handleToken(data.token, this.returnUrl);
    } catch (err) {
      this.sharedService.showRequestError(err);
    }
  }

  async signInWithGoogle() {
    try {
      this.externalUser = await this.socialAuthService.signIn(
        GoogleLoginProvider.PROVIDER_ID
      );

      this.isOauthLogin = true;

      const response = await this.authService
        .validateEmail(null, this.externalUser.email)
        .toPromise();

      if (response.message) {
        const sendData = {
          provider: this.externalUser.provider,
          idToken: this.externalUser.idToken,
        };

        const data = await this.authService.googleLogin(sendData);

        this.loginSharedService.handleToken(data.token, this.returnUrl);
      } else {
        this.loginForm = this.fb.group({
          phoneNumber: ['', Validators.required],
        });

        this.container.nativeElement.style.height = '300px';
      }
    } catch (error) {
      this.sharedService.showRequestError(error);
    }

    this.cdr.markForCheck();
  }
}

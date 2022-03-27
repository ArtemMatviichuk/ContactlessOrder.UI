import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser,
} from 'angularx-social-login';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
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
  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService,
    private socialAuthService: SocialAuthService,
    private loginSharedService: LoginSharedService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.sharedService.validateFormFields(this.loginForm);

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'];
  }

  async login() {
    this.sharedService.startBlockUI();

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
    
    this.sharedService.stopBlockUI();
  }

  async signInWithGoogle() {
    this.sharedService.startBlockUI();

    try {
      this.externalUser = await this.socialAuthService.signIn(
        GoogleLoginProvider.PROVIDER_ID
      );

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
        this.isOauthLogin = true;
        this.initializeNumberForm();
      }
    } catch (error) {
      this.sharedService.showRequestError(error);
    }

    this.cdr.markForCheck();
    this.sharedService.stopBlockUI();
  }

  private initializeNumberForm() {
    this.loginForm = this.fb.group({
      phoneNumber: [
        '+380',
        [Validators.required, Validators.pattern(/\+380\d{9}/)],
        this.uniqueValidator((value) =>
          this.authService.validatePhoneNumber(null, value)
        ),
      ],
    });

    this.loginForm.controls.phoneNumber.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (!value.startsWith('+380')) {
          this.loginForm.controls.phoneNumber.patchValue('+380');
        }
      });

    this.container.nativeElement.style.height = '300px';
    this.cdr.markForCheck();
  }

  private uniqueValidator =
    (validate: (value) => Observable<any>) => (control: AbstractControl) =>
      validate(control.value).pipe(
        map((result) =>
          result?.message ? { notUnique: result.message } : null
        ),
        tap(() => this.cdr.markForCheck())
      );
}

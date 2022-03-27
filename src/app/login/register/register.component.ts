import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
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
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { LoginSharedService } from '../login-shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('container') container: ElementRef<HTMLDivElement>;

  public registerForm: FormGroup;
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
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        this.uniqueValidator((value) =>
          this.authService.validateEmail(null, value)
        ),
      ],
      phoneNumber: [
        '+380',
        [Validators.required, Validators.pattern(/\+380\d{9}/)],
        this.uniqueValidator((value) =>
          this.authService.validatePhoneNumber(null, value)
        ),
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      repeatPassword: ['', Validators.required],
    });
  }

  public ngOnInit() {
    this.sharedService.validateFormFields(this.registerForm);

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'];

    this.subscribeToChanges();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async register() {
    this.sharedService.startBlockUI();
    
    try {
      if (this.isOauthLogin) {
        const sendData = {
          provider: this.externalUser.provider,
          idToken: this.externalUser.idToken,
          phoneNumber: this.registerForm.controls.phoneNumber.value,
        };

        const data = await this.authService.googleLogin(sendData);
        this.loginSharedService.handleToken(data.token, this.returnUrl);
      } else {
        const formValue = this.registerForm.value;

        const data = await this.authService.register(formValue);

        this.sharedService.openWarningDialog(data.message);
      }
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
        this.initializeNumberForm();
      }
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
    
    this.sharedService.stopBlockUI();
  }

  private initializeNumberForm() {
    this.registerForm = this.fb.group({
      phoneNumber: [
        '+380',
        [Validators.required, Validators.pattern(/\+380\d{9}/)],
        this.uniqueValidator((value) =>
          this.authService.validatePhoneNumber(null, value)
        ),
      ],
    });

    this.registerForm.controls.phoneNumber.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (!value.startsWith('+380')) {
          this.registerForm.controls.phoneNumber.patchValue('+380');
        }
      });

    this.container.nativeElement.style.height = '300px';
    this.cdr.markForCheck();
  }

  private subscribeToChanges() {
    this.registerForm.controls.phoneNumber.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (!value.startsWith('+380')) {
          this.registerForm.controls.phoneNumber.patchValue('+380');
        }
      });

    this.registerForm.controls.repeatPassword.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value !== this.registerForm.controls.password.value) {
          this.registerForm.controls.repeatPassword.setErrors({
            notEquel: true,
          });
        }
      });

    this.registerForm.controls.password.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (
          value !== this.registerForm.controls.repeatPassword.value &&
          this.registerForm.controls.repeatPassword.dirty
        ) {
          this.registerForm.controls.repeatPassword.setErrors({
            notEquel: true,
          });
        }
      });
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

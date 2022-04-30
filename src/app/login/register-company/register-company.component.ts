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
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterCompanyComponent implements OnInit, OnDestroy {
  @ViewChild('container') container: ElementRef<HTMLDivElement>;

  public registerForm: FormGroup;
  public moreActions = false;

  private returnUrl: string;
  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    this.registerForm = fb.group({
      name: [
        '',
        Validators.required,
        this.uniqueValidator((value) =>
          this.authService.validateCompanyName(null, value)
        ),
      ],
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
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    this.subscribeToChanges();
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  async register() {
    try {
      const formValue = this.registerForm.value;

      const data = await this.authService.registerCompany(formValue);
      this.sharedService.openWarningDialog(data.message);
    } catch (err) {
      this.sharedService.showRequestError(err);
    }
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

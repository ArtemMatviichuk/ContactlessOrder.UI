import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../company-settings.service';
import { ChangePaymentDataComponent } from '../../../../shared/change-payment-data/change-payment-data.component';

@Component({
  selector: 'app-company-settings',
  templateUrl: './company-settings.component.html',
  styleUrls: ['./company-settings.component.scss'],
})
export class CompanySettingsComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  public logo: any;
  public defaultLogo = PLACEHOLDER_IMAGE;

  public editMode = false;

  public company: any;
  private newLogo: any;

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dialog: MatDialog,
    private companySettingsService: CompanySettingsService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = fb.group({
      name: [
        null,
        Validators.required,
        this.uniqueValidator((value) =>
          this.companySettingsService.validateCompanyName(
            this.company.userId,
            value
          )
        ),
      ],
      address: [null],
      email: [
        '',
        [Validators.required, Validators.email],
        this.uniqueValidator((value) =>
          this.companySettingsService.validateEmail(this.company.userId, value)
        ),
      ],
      phoneNumber: [
        '+380',
        [Validators.required, Validators.pattern(/\+380\d{9}/)],
        this.uniqueValidator((value) =>
          this.companySettingsService.validatePhoneNumber(
            this.company.userId,
            value
          )
        ),
      ],
      description: [null],
    });
  }

  public async ngOnInit() {
    await Promise.all([this.getCompany(), this.getCompanyLogo()]);
    this.sharedService.validateFormFields(this.form);

    this.setData();
    this.subscribeToChanges();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public async changePaymentData() {
    const config = new MatDialogConfig();
    config.width = '500px';
    config.data = { ...this.company };

    if (this.company.paymentDataId) {
      try {
        config.data.paymentData =
          await this.companySettingsService.getPaymentData();
      } catch (error) {
        this.sharedService.showRequestError(error);
        return;
      }
    }

    this.dialog
      .open(ChangePaymentDataComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getCompany();
        }
      });
  }

  public startEdit() {
    this.editMode = true;
    this.cdr.markForCheck();
  }

  public changeLogo(event) {
    const file = event.target.files[0];

    if (file) {
      this.logo = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(file)
      );

      this.newLogo = file;
      this.cdr.markForCheck();
    }
  }

  public removeLogo() {
    this.logo = this.defaultLogo;
    this.newLogo = null;

    this.cdr.markForCheck();
  }

  public async saveChanges() {
    this.editMode = false;

    const data = {
      ...this.form.value,
      removeLogo: this.logo === this.defaultLogo,
      logo: this.newLogo,
    };

    try {
      await this.companySettingsService.updateCompanyData(data);
    } catch (error) {
      this.sharedService.showRequestError(error);
    }

    this.cdr.markForCheck();
  }

  private async getCompany() {
    try {
      this.company = await this.companySettingsService.getCompany();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async getCompanyLogo() {
    try {
      const logo = await this.companySettingsService.getCompanyLogo();
      this.logo = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(logo)
      );
    } catch (error) {
      this.logo = this.defaultLogo;
    }

    this.cdr.markForCheck();
  }

  private setData() {
    this.form.patchValue(this.company);
    this.cdr.markForCheck();
  }

  private subscribeToChanges() {
    this.form.controls.phoneNumber.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (!value.startsWith('+380')) {
          this.form.controls.phoneNumber.patchValue('+380');
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

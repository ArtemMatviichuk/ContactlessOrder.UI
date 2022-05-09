import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, of, tap } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../company/apps/company-settings/company-settings.service';

@Component({
  selector: 'app-change-payment-data',
  templateUrl: './change-payment-data.component.html',
  styleUrls: ['./change-payment-data.component.scss'],
})
export class ChangePaymentDataComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  constructor(
    fb: FormBuilder,
    private companyService: CompanySettingsService,
    private dialogRef: MatDialogRef<ChangePaymentDataComponent>,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      name: [null, Validators.required],
      bank: [null, Validators.required],
      mfo: [
        null,
        Validators.required,
        this.validator((value) => this.mfoValidator(value)),
      ],
      legalEntityCode: [
        null,
        Validators.required,
        this.validator((value) => this.legalEntityCodeValidator(value)),
      ],
      currentAccount: [
        null,
        Validators.required,
        this.validator((value) => this.currentAccountValidator(value)),
      ],
      taxNumber: [
        null,
        Validators.required,
        this.validator((value) => this.taxNumberValidator(value)),
      ],
    });
  }

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());

    this.sharedService.validateFormFields(this.form);

    this.setData();
  }

  public ngOnDestroy() {}

  public async close() {
    if (this.form.dirty) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Відмінити зміни?'
      );

      if (result !== 'ok') return;
    }

    this.dialogRef.close({ success: false });
  }

  public async save() {
    const result = await this.sharedService.openConfirmActionDialog(
      'Після зміни платіжної інформації, вас буде виключено з сервісів до закінчення перевірки. Продовжити?'
    );

    if (result !== 'ok') {
      return;
    }

    const data = this.form.value;

    try {
      await this.companyService.updatePaymentData(data);
      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async setData() {
    if (this.dialogData.paymentData) {
      this.form.patchValue(this.dialogData.paymentData);
    } else {
      this.form.controls.name.patchValue(this.dialogData.name);
    }

    if (this.dialogData.preview) {
      this.form.disable();
    }
  }

  private mfoValidator(value): Observable<any> {
    const normal = /[0-9]{6}/.test(value) && value?.length === 6;
    const result = normal ? null : { message: 'МФО має складатися з 6 цифр' };

    return of(result);
  }

  private legalEntityCodeValidator(value): Observable<any> {
    const normal = /[0-9]{8}/.test(value) && value?.length === 8;
    const result = normal
      ? null
      : { message: 'Код ЄДРПОУ має складатися з 8 цифр' };

    return of(result);
  }

  private currentAccountValidator(value): Observable<any> {
    const normal = /[0-9]{14}/.test(value) && value?.length === 14;
    const result = normal ? null : { message: 'Р/Р має складатися з 14 цифр' };

    return of(result);
  }

  private taxNumberValidator(value): Observable<any> {
    const normal = /[0-9]{12}/.test(value) && value?.length === 12;
    const result = normal ? null : { message: 'ІПН має складатися з 12 цифр' };

    return of(result);
  }

  private validator =
    (validate: (value) => Observable<any>) => (control: AbstractControl) =>
      validate(control.value).pipe(
        map((result) => (result?.message ? { wrong: result.message } : null)),
        tap(() => this.cdr.markForCheck())
      );
}

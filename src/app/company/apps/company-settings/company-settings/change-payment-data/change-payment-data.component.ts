import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../company-settings.service';

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
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      name: [null, Validators.required],
      bank: [null, Validators.required],
      mfo: [null, Validators.required],
      legalEntityCode: [null, Validators.required],
      currentAccount: [null, Validators.required],
      taxNumber: [null, Validators.required],
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
    const data = this.form.value;

    try {
      await this.companyService.updatePaymentData(data);
      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async setData() {
    if (this.dialogData.paymentDataId) {
      const data = await this.companyService.getPaymentData();
      this.form.patchValue(data);
    } else {
      this.form.controls.name.patchValue(this.dialogData.name);
    }
  }
}

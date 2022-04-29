import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientService } from '../../client.service';
import { PAYMENT_METHODS } from '../../constants';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
  public form: FormGroup;
  public paymentMethods = [];

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrderComponent>,
    private clientService: ClientService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) dialogData: any
  ) {
    this.form = fb.group({
      paymentMethodValue: [PAYMENT_METHODS.cash, Validators.required],
      comment: [null],
    });
  }

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());

    this.sharedService.validateFormFields(this.form);
    this.getPaymentMethods();
  }

  public save() {
    this.dialogRef.close({ success: true, value: this.form.value });
  }

  public async close() {
    if (this.form.dirty) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Відмінити?'
      );

      if (result !== 'ok') {
        return;
      }
    }

    this.dialogRef.close({ success: false });
  }

  private async getPaymentMethods() {
    try {
      this.paymentMethods = await this.clientService.getPaymentMethods();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CateringPositionComponent } from 'src/app/shared/catering-position/catering-position.component';
import { ChangePaymentDataComponent } from 'src/app/shared/change-payment-data/change-payment-data.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-preview-company',
  templateUrl: './preview-company.component.html',
  styleUrls: ['./preview-company.component.scss'],
})
export class PreviewCompanyComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public caterings = [];

  public showCaterings = false;

  constructor(
    fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PreviewCompanyComponent>,
    private toastr: ToastrService,
    private adminService: AdminService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      name: [null],
      email: [null],
      phoneNumber: [null],
      address: [null],
      registeredDate: [null],
      description: [null],
    })
  }

  public async ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => this.close());

    await this.getCaterings();

    this.form.patchValue({...this.dialogData, registeredDate: this.sharedService.getDateString(this.dialogData.registeredDate) });
  }

  public ngOnDestroy(): void {}

  public close() {
    this.dialogRef.close({ success: true });
  }

  public async openPaymnetData() {
    try {
      const config = new MatDialogConfig();
      config.width = '600px';
      config.data = {
        preview: true,
      };

      if (this.dialogData.paymentDataId) {
        config.data.paymentData = await this.adminService.getCompanyPaymentData(
          this.dialogData.paymentDataId
        );
      }

      this.dialog.open(ChangePaymentDataComponent, config);
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async approve() {
    if (!this.dialogData.paymentDataId) {
      this.sharedService.openWarningDialog("Компанія не має платіжних даних");
      return;
    }

    const result = await this.sharedService.openConfirmActionDialog(
      'Ви дійсно хочете схвали цю компанію (всі заклади харчування стануть доступними)?'
    );

    if (result !== 'ok') {
      return;
    }

    try {
      await this.adminService.approveCompany(this.dialogData.id);

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async reject() {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви дійсно хочете відмінити цю компанію (всі заклади харчування стануть недоступними)?'
    );

    if (result !== 'ok') {
      return;
    }

    try {
      await this.adminService.rejectCompany(this.dialogData.id);

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async viewCateringPosition(catering) {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.data = { catering };

    this.dialog.open(CateringPositionComponent, config);
  }

  public copyValue(value) {
    navigator.clipboard.writeText(value);
    this.toastr.success("Скопійовано до буферу обміну");
  }

  private async getCaterings() {
    try {
      this.caterings = await this.adminService.getCaterings(this.dialogData.id);
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

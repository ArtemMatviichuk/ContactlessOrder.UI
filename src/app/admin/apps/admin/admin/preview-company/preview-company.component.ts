import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CateringPositionComponent } from 'src/app/shared/catering-position/catering-position.component';
import { ChangePaymentDataComponent } from 'src/app/shared/change-payment-data/change-payment-data.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-preview-company',
  templateUrl: './preview-company.component.html',
  styleUrls: ['./preview-company.component.scss'],
})
export class PreviewCompanyComponent implements OnInit, OnDestroy {
  public caterings = [];

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PreviewCompanyComponent>,
    private adminService: AdminService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  public async ngOnInit() {
    this.dialogRef.backdropClick().subscribe(() => this.close());

    await this.getCaterings();
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

  private async getCaterings() {
    try {
      this.caterings = await this.adminService.getCaterings(this.dialogData.id);
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

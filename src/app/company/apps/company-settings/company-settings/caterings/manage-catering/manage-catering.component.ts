import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../../company-settings.service';

@Component({
  selector: 'app-manage-catering',
  templateUrl: './manage-catering.component.html',
  styleUrls: ['./manage-catering.component.scss'],
})
export class ManageCateringComponent {
  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ManageCateringComponent>,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  public copyLogin() {
    navigator.clipboard.writeText(this.dialogData.login)
    this.toastr.success("Логін скопійовано до буферу обміну")
  }

  public async generatePassword() {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви впевнені, що хочете змінити пароль?'
    );

    if (result === 'ok') {
      const newPass =
        await this.companySettingsService.generateCateringPassword(
          this.dialogData.id
        );

      this.sharedService.showTemplate(this.getTemplate(newPass));
    }
  }

  public async delete() {
    const result = await this.sharedService.openConfirmDeleteDialog(
      'Ви впевнені, що хочете ВИДАЛИТИ цю точку?'
    );

    if (result !== 'delete') {
      return;
    }

    try {
      await this.companySettingsService.deleteCatering(this.dialogData.id);
      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async close() {
    this.dialogRef.close({ success: false });
  }

  private getTemplate(newPass) {
    return `<p>Нові данні для входу:</p>
      <p>Логін: ${this.dialogData.login}</p>
      <p>Пароль: ${newPass.password}</p>`;
  }
}

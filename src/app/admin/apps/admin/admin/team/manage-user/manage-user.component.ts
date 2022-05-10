import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent implements OnInit, OnDestroy {
  constructor(
    private adminService: AdminService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<ManageUserComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public async generatePassword() {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви впевнені, що хочете змінити пароль для цього облікового запису?'
    );

    if (result !== 'ok') {
      return;
    }

    try {
      const response = await this.adminService.generatePassword(
        this.dialogData.id
      );

      this.sharedService.openWarningDialog(
        `ЗАПИШІТЬ НОВИЙ ПАРОЛЬ: ${response.password}`
      );

      this.dialogRef.close();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async deleteUser() {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви впевнені, що хочете ВИДАЛИТИ цей обліковий запис?'
    );

    if (result !== 'ok') {
      return;
    }

    try {
      await this.adminService.deleteUser(this.dialogData.id);
      this.dialogRef.close();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

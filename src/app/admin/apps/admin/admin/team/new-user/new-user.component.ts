import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminService } from '../../../admin.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss'],
})
export class NewUserComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private adminService: AdminService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<NewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phoneNumber: [
        '+380',
        [Validators.required, Validators.pattern(/\+380\d{9}/)],
      ],
    });
  }

  ngOnInit(): void {
    this.sharedService.validateFormFields(this.form);

    this.form.controls.phoneNumber.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (!value.startsWith('+380')) {
          this.form.controls.phoneNumber.patchValue('+380');
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public async save() {
    const data = { ...this.form.value, roleValue: this.dialogData.roleValue };

    try {
      var loginData = await this.adminService.createUser(data);
      this.sharedService.showTemplate(
        this.getPasswordTemplate(loginData),
        '450px'
      );

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async close() {
    if (this.form.dirty) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Відмінити зміни?'
      );

      if (result !== 'ok') return;
    }

    this.dialogRef.close({ success: false });
  }

  private getPasswordTemplate(loginData) {
    return `<p>ЗАПИШІТЬ ЦЮ ІНФОРМАЦІЮ</p>
    <p>Для входу в обліковий запис:</p>
    <p>Логін: ${loginData.email}</p>
    <p>Пароль: ${loginData.password}</p>
    `;
  }
}

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../../company-settings.service';

@Component({
  selector: 'app-new-catering',
  templateUrl: './new-catering.component.html',
  styleUrls: ['./new-catering.component.scss'],
})
export class NewCateringComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewCateringComponent>,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      name: [null, Validators.required],
      coordinates: [''],
      fullDay: [false],
      openTime: [{ hour: 9, minute: 0 }, Validators.required],
      closeTime: [{ hour: 18, minute: 0 }, Validators.required],
    });
  }

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());

    this.setData();

    this.subscribeToChanges();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public async save() {
    //const coordinates = ...
    const formValue = this.form.value;
    const data = {
      ...formValue,
    };
    
    try {
      if (this.dialogData.add) {
        var loginData = await this.companySettingsService.createCatering(data);
        this.sharedService.showTemplate(this.getPasswordTemplate(loginData), "450px");
      } else {
        await this.companySettingsService.updateCatering(
          this.dialogData.id,
          data
        );
      }

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async close() {
    if (this.form.dirty) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Discard changes'
      );

      if (result !== 'ok') return;
    }

    this.dialogRef.close({ success: false });
  }

  private setData() {
    if (!this.dialogData.add) {
      this.form.patchValue(this.dialogData);

      if (this.dialogData.fullDay) {
        this.form.controls.openTime.disable();
        this.form.controls.closeTime.disable();
      }
    }
  }

  private getPasswordTemplate(loginData) {
    return `<p>ЗАПИШІТЬ ЦЮ ІНФОРМАЦІЮ</p>
    <p>Для входу під аккаунтом цієї точки:</p>
    <p>Логін: ${loginData.email}</p>
    <p>Пароль: ${loginData.password}</p>
    `;
  }

  private subscribeToChanges() {
    this.form.controls.fullDay.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value) {
          this.form.controls.openTime.patchValue(null);
          this.form.controls.closeTime.patchValue(null);

          this.form.controls.openTime.disable();
          this.form.controls.closeTime.disable();
        } else {
          this.form.controls.openTime.patchValue(this.dialogData.openTime);
          this.form.controls.closeTime.patchValue(this.dialogData.closeTime);

          this.form.controls.openTime.enable();
          this.form.controls.closeTime.enable();
        }
      });
  }
}

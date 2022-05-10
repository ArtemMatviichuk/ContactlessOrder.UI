import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { COMPLAIN_STATUSES, COMPLAIN_STATUS_VALUES } from '../../constants';
import { SupportService } from '../../support.service';

@Component({
  selector: 'app-preview-complain',
  templateUrl: './preview-complain.component.html',
  styleUrls: ['./preview-complain.component.scss'],
})
export class PreviewComplainComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  public statuses = COMPLAIN_STATUSES;

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private supportService: SupportService,
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<PreviewComplainComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      userName: [null],
      userEmail: [null],
      userPhoneNumber: [null],
      companyName: [null],
      companyEmail: [null],
      companyPhoneNumber: [null],
      cateringName: [null],
      createdDate: [null],
      content: [null],
      orderNumber: [null],
      status: [null],
    });
  }

  public ngOnInit() {
    this.form.patchValue(this.dialogData);

    this.form.controls.status.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => this.onStatusChange(value));
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public copyValue(value) {
    this.sharedService.copyValue(value);
  }

  public async onStatusChange(status) {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви дійсно хочете змінити статус скарги?'
    );

    if (result === 'ok') {
      try {
        await this.supportService.changeComplainStatus(
          this.dialogData.id,
          status
        );

        this.dialogRef.close({ success: true });
      } catch (error) {
        this.sharedService.showRequestError(error);
        this.form.controls.status.patchValue(this.dialogData.status, {
          emitEvent: false,
        });
      }
    } else {
      this.form.controls.status.patchValue(this.dialogData.status, {
        emitEvent: false,
      });
    }
  }
}

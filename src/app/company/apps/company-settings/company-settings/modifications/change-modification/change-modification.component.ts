import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../../company-settings.service';

@Component({
  selector: 'app-change-modification',
  templateUrl: './change-modification.component.html',
  styleUrls: ['./change-modification.component.scss'],
})
export class ChangeModificationComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<ChangeModificationComponent>,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      name: [null, Validators.required],
      price: [null, Validators.required],
    });
  }

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());

    this.form.patchValue(this.dialogData);

    this.form.controls.price.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        const isMatch = /^[0-9]+$/.test(value);

        if (!isMatch) {
          this.form.controls.price.patchValue(value.replace(/[^0-9]/, ''), {
            emitEvent: false,
          });
        }
      });
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
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

  public async save() {
    const data = this.form.value;

    try {
      await this.companySettingsService.updateModification(
        this.dialogData.id,
        data
      );

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

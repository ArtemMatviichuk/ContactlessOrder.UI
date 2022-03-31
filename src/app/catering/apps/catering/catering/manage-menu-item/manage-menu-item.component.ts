import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CateringService } from '../../catering.service';

@Component({
  selector: 'app-manage-menu-item',
  templateUrl: './manage-menu-item.component.html',
  styleUrls: ['./manage-menu-item.component.scss'],
})
export class ManageMenuItemComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private cateringService: CateringService,
    private dialogRef: MatDialogRef<ManageMenuItemComponent>,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      name: [null],
      description: [null],
      available: [null],
      price: [null],
      inheritPrice: [null],
    });
  }

  public ngOnInit(): void {
    this.subscribeToChanges();
    this.form.patchValue(this.dialogData);
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public async save() {
    const formValue = this.form.getRawValue();

    try {
      await this.cateringService.updateMenuOption(
        this.dialogData.id,
        formValue
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

  private subscribeToChanges() {
    this.form.controls.inheritPrice.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value) {
          this.form.controls.price.disable();
        } else {
          this.form.controls.price.enable();
        }
      });

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
}

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-company-settings',
  templateUrl: './select-items.component.html',
  styleUrls: ['./select-items.component.scss'],
})
export class SelectItemsComponent implements OnInit, OnDestroy {
  public valueCtrl = new FormControl(null);
  public allItems = false;

  private onDestroy$ = new Subject<void>();

  constructor(
    private sharedService: SharedService,
    private dialogRef: MatDialogRef<SelectItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());

    this.valueCtrl.patchValue(this.dialogData.value);
    if (this.dialogData.required) {
      this.valueCtrl.setValidators([Validators.required]);
    }

    this.valueCtrl.markAllAsTouched();

    if (this.dialogData.multiple) {
      this.allItems =
        this.dialogData.items.length === this.dialogData.value?.length;

      this.valueCtrl.valueChanges
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
          (value) =>
            (this.allItems = value.length === this.dialogData.items.length)
        );
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public save() {
    this.dialogRef.close({ success: true, value: this.valueCtrl.value });
  }

  public async close() {
    if (this.valueCtrl.dirty) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Відмінити зміни?'
      );
      if (result !== 'ok') {
        return;
      }
    }

    this.dialogRef.close({ success: false });
  }

  public onAllItems() {
    if (this.allItems) {
      this.valueCtrl.patchValue(
        this.dialogData.items.map((e) =>
          this.dialogData.bindValue ? e[this.dialogData.bindValue] : e.id
        )
      );
    } else {
      this.valueCtrl.patchValue([]);
    }
  }
}

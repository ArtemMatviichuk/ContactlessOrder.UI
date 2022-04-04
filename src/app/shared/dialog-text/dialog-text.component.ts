import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-dialog-text',
  templateUrl: './dialog-text.component.html',
  styleUrls: ['./dialog-text.component.scss'],
})
export class DialogTextComponent {
  public commentCtrl = new FormControl(null);

  constructor(
    private dialogRef: MatDialogRef<DialogTextComponent>,
    private sharedService: SharedService
  ) {}

  public save() {
    this.dialogRef.close({ success: true, value: this.commentCtrl.value });
  }

  public async close() {
    if (this.commentCtrl.dirty) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Відмінити?'
      );

      if (result !== 'ok') {
        return;
      }
    }

    this.dialogRef.close({ success: false });
  }
}

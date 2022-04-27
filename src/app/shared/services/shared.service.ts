import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BlockUIService } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, tap } from 'rxjs';
import { NOTIFICATION_SOUND } from '../constants/sounds';
import { ModalConfirmComponent } from '../modal-confirm/modal-confirm.component';
import { ModalTemplateComponent } from '../modal-template/modal-template.component';
import { ModalWarningComponent } from '../modal-warning/modal-warning.component';
import { WarningDeletedComponent } from '../warning-deleted/warning-deleted.component';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public appsPreload = true;

  private sound = new Howl({ src: [NOTIFICATION_SOUND] });

  constructor(
    private toastr: ToastrService,
    private blockUIServise: BlockUIService,
    private dialog: MatDialog
  ) {}

  /**
   * Show request errors
   * @param err {Error}
   */
  public showRequestError(err) {
    if (err?.error?.message) {
      this.openWarningDialog(err.error.message, '350px');
      return;
    }

    if (err && err.message) {
      if (err.error instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = (_) => {
          const error = JSON.parse(reader.result as string);
          this.openWarningDialog(error.message, '350px');
        };
        reader.readAsText(err.error);

        return;
      }

      this.toastr.error(err.message);
    }
  }

  /**
   * Validation confirmation password
   * @param otherControlName {string}
   */
  public matchOtherValidator(otherControlName: string) {
    let thisControl: FormControl;
    let otherControl: FormControl;

    return function matchOtherValidate(control: FormControl) {
      if (!control.parent) {
        return null;
      }
      // Initializing the validator.
      if (!thisControl) {
        thisControl = control;
        otherControl = control.parent.get(otherControlName) as FormControl;
        if (!otherControl) {
          throw new Error(
            'matchOtherValidator(): other control is not found in parent group'
          );
        }
        otherControl.valueChanges.subscribe(() => {
          thisControl.updateValueAndValidity();
        });
      }

      if (!otherControl) {
        return null;
      }

      if (otherControl.value !== thisControl.value) {
        return {
          matchOther: true,
        };
      }

      return null;
    };
  }

  public getDateTimeString(value) {
    if (!value) {
      return null;
    }

    return formatDate(value, 'dd/MM/yyyy HH:mm ', 'en-US');
  }

  public showTemplate(htmlTemplate: string, width?: string) {
    this.openWarningTemplate(htmlTemplate, width);
  }

  public openWarningDialog(message: string, width = '320px') {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = width;
    dialogConfig.data = {
      message: message,
    };
    this.dialog.open(ModalWarningComponent, dialogConfig);
  }

  public openWarningTemplate(htmlTemplate: string, width = '320px') {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = width;
    dialogConfig.data = {
      template: htmlTemplate,
    };

    this.dialog.open(ModalTemplateComponent, dialogConfig);
  }

  public openConfirmDeleteDialog(message?: string): Promise<string> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '420px';
    dialogConfig.data = { message };

    return this.dialog
      .open(WarningDeletedComponent, dialogConfig)
      .afterClosed()
      .toPromise();
  }

  public openConfirmActionDialog(
    message: string,
    width = '320px'
  ): Promise<string> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = width;
    dialogConfig.data = { message };

    return this.dialog
      .open(ModalConfirmComponent, dialogConfig)
      .afterClosed()
      .toPromise();
  }

  public startBlockUI(): void {
    this.blockUIServise.start('block-ui-main', 'Loading...');
  }

  public stopBlockUI(): void {
    this.blockUIServise.stop('block-ui-main');
  }

  public validateFormFields(form: FormGroup) {
    for (const ctrl of Object.keys(form.controls)) {
      form.get(ctrl).markAsTouched();
    }
  }

  public uniqueValidator =
    (validate: (value) => Observable<any>) => (control: AbstractControl) =>
      validate(control.value).pipe(
        map((result) =>
          result?.message ? { notUnique: result.message } : null
        )
      );

  public playNotificationSound() {
    this.sound.play();
  }
}

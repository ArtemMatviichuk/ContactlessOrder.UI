import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';
import { Subject, takeUntil } from 'rxjs';
import {
  PicturesSelectorComponent,
  PicturesSelectorOptions,
} from 'src/app/shared/pictures/pictures.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../../company-settings.service';

@Component({
  selector: 'app-new-menu-item',
  templateUrl: './new-menu-item.component.html',
  styleUrls: ['./new-menu-item.component.scss'],
})
export class NewMenuItemComponent implements OnInit, OnDestroy {
  @ViewChild(PicturesSelectorComponent)
  picturesSelector: PicturesSelectorComponent;
  public form: FormGroup;

  public pictureOptions: PicturesSelectorOptions = {
    add: this.dialogData.add,
    edit: this.dialogData.edit,
    preview: this.dialogData.preview,
    loadPicturesAsync: () => this.getPictures(),
  };

  public options = [];
  public selectedOption = null;

  public optionsGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Назва опції',
        field: 'name',
        editable: true,
      },
      {
        headerName: 'Ціна (грн.)',
        field: 'price',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        editable: true,
        type: 'numericColumn',
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-trash"></i>`,
        onCellClicked: (params) => this.deleteOption(),
      },
    ],

    defaultColDef: {
      flex: 1,

      tooltipValueGetter: (params) => params.value,
    },

    rowSelection: 'single',
    enableBrowserTooltips: true,

    getRowId: (data) => data.data.id,

    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    suppressRowTransform: true,

    onRowSelected: (event) => this.selectOption(event),

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  private nextOptionId = -1;
  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewMenuItemComponent>,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.form = fb.group({
      name: [null, Validators.required],
      description: [null],
    });
  }

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());
    this.sharedService.validateFormFields(this.form);

    this.setData();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public getTitle() {
    if (this.dialogData.add) {
      return 'Додати опцію меню';
    } else {
      return 'Змінити опцію меню';
    }
  }

  public addOption() {
    const lastItem = this.options[this.options.length - 1];
    if (!lastItem || (lastItem.name && lastItem.price)) {
      this.options = [...this.options, { id: this.nextOptionId }];
      this.nextOptionId--;
      this.cdr.markForCheck();
    }
  }

  public async save() {
    const formValue = this.form.value;
    const data = {
      ...formValue,
      options: this.options.map((e) => (e.id > 0 ? e : { ...e, id: null })),
      pictures: this.picturesSelector.getUploadedPictureFiles(),
    };

    try {
      if (this.dialogData.add) {
        await this.companySettingsService.createMenuItem(data);
      } else {
        data.deletedPictureIds = this.picturesSelector.getDeletedPictureIds();

        await this.companySettingsService.updateMenuItem(
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
        'Відмінити зміни?'
      );

      if (result !== 'ok') return;
    }

    this.dialogRef.close({ success: false });
  }

  private setData() {
    if (!this.dialogData.add) {
      this.form.patchValue(this.dialogData);

      this.options = this.dialogData.options;
    }
  }

  private async getPictures() {
    try {
      const pictures = await this.companySettingsService.getMenuItemPictures(
        this.dialogData.id
      );

      return pictures.map((i) => ({
        fileName: i.fileName,
        url: this.companySettingsService.getMenuItemPictureUrl(i.id),
        id: i.id,
      }));
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private selectOption(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedOption = event.data;

    this.cdr.markForCheck();
  }

  private async deleteOption() {
    const result = await this.sharedService.openConfirmDeleteDialog(
      'Ви впевнені, що хочете ВИДАЛИТИ цей запис?'
    );

    if (result !== 'delete') {
      return;
    }

    this.options = this.options.filter((e) => e.id !== this.selectedOption.id);
  }
}

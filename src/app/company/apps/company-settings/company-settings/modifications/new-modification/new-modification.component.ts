import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../../company-settings.service';

@Component({
  selector: 'app-new-modification',
  templateUrl: './new-modification.component.html',
  styleUrls: ['./new-modification.component.scss'],
})
export class NewModificationComponent implements OnInit, OnDestroy {
  public modifications = [];
  public selectedModification = null;

  public modificationsGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Назва добавки',
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
        onCellClicked: (params) => this.deleteModification(),
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

    onRowSelected: (event) => this.selectModification(event),

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  private nextModificationId = -1;
  private onDestroy$ = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<NewModificationComponent>,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public addModification() {
    const lastItem = this.modifications[this.modifications.length - 1];
    if (!lastItem || (lastItem.name && lastItem.price)) {
      this.modifications = [
        ...this.modifications,
        { id: this.nextModificationId },
      ];
      this.nextModificationId--;
      this.cdr.markForCheck();
    }
  }

  public async save() {
    const modifications = this.modifications.map((e) =>
      e.id > 0 ? e : { ...e, id: null }
    );

    try {
      await this.companySettingsService.createModifications(modifications);

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async close() {
    if (this.modifications.length > 0) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Відмінити зміни?'
      );

      if (result !== 'ok') return;
    }

    this.dialogRef.close({ success: false });
  }

  private selectModification(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedModification = event.data;

    this.cdr.markForCheck();
  }

  private async deleteModification() {
    const result = await this.sharedService.openConfirmDeleteDialog();

    if (result !== 'delete') {
      return;
    }

    this.modifications = this.modifications.filter(
      (e) => e.id !== this.selectedModification.id
    );
  }
}

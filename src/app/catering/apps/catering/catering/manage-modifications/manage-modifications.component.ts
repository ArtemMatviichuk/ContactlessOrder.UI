import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { ImageCellRendererComponent } from 'src/app/shared/image-cell-renderer/image-cell-renderer.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CateringService } from '../../catering.service';

@Component({
  selector: 'app-manage-modifications',
  templateUrl: './manage-modifications.component.html',
  styleUrls: ['./manage-modifications.component.scss'],
})
export class ManageModificationsComponent implements OnInit, OnDestroy {
  public items = [];

  public modificationsGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Добавки',
        field: 'name',
        editable: false,
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
        headerName: 'Доступно',
        field: 'available',
        cellRenderer: 'checkboxRenderer',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        onCellClicked: (params) => this.changeAvailability(params.data),
      },
    ],

    defaultColDef: {
      flex: 1,

      tooltipValueGetter: (params) => params.value,
    },

    frameworkComponents: {
      checkboxRenderer: CheckboxCellRendererComponent,
    },

    rowSelection: 'single',
    enableBrowserTooltips: true,

    getRowId: (data) => data.data.id,

    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    suppressRowTransform: true,

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  constructor(
    private cateringService: CateringService,
    private dialogRef: MatDialogRef<ManageModificationsComponent>,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  public ngOnInit() {
    this.items = this.dialogData.modifications;
  }

  public ngOnDestroy() {}

  public changeAvailability(data) {
    const index = this.items.findIndex((e) => e.id === data.id);

    this.items.splice(index, 1, {
      ...this.items[index],
      available: !this.items[index].available,
    });

    this.items = [...this.items];
  }
}

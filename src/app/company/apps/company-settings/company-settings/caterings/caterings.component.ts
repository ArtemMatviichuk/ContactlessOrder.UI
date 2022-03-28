import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  CellDoubleClickedEvent,
  ColumnApi,
  GridApi,
  GridOptions,
  RowSelectedEvent,
} from 'ag-grid-community';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../company-settings.service';
import { NewCateringComponent } from './new-catering/new-catering.component';

@Component({
  selector: 'app-caterings',
  templateUrl: './caterings.component.html',
  styleUrls: ['./caterings.component.scss'],
})
export class CateringsComponent implements OnInit, OnDestroy {
  public caterings = [];
  public selectedCatering = null;

  public cateringsGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'ТОЧКИ',
        field: 'name',
      },
      {
        headerName: 'Координати',
        field: 'coordinates',
      },
      {
        headerName: 'Цілодобово',
        field: 'fullDay',
      },
      {
        headerName: 'Час відкриття',
        field: 'openTime',
      },
      {
        headerName: 'Час закриття',
        field: 'closeTime',
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellClass: 'fa fa-pencil',
        onCellClicked: (params) => this.editCatering(params.data.id),
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellClass: 'fa-solid fa-gear',
        onCellClicked: (params) => this.openManageCatering(params.data.id),
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

    onGridReady: async (event) => {
      this.cateringTable = event.api;
      this.cateringColumnApi = event.columnApi;
    },

    onRowSelected: (event) => this.selectCatering(event),

    onCellDoubleClicked: (event) => this.onCellDoubleClick(event),

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  private cateringTable: GridApi;
  private cateringColumnApi: ColumnApi;

  constructor(
    private dialog: MatDialog,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.getCaterings();
  }

  public ngOnDestroy() {}

  public addCatering() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { add: true };

    return this.dialog
      .open(NewCateringComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getCaterings();
        }
      });
  }

  public editCatering(id) {
    console.log(id);
  }

  public openManageCatering(id) {
    console.log(id);
  }

  private async getCaterings() {
    try {
      this.caterings = await this.companySettingsService.getCatering();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private selectCatering(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedCatering = event.data;

    this.cdr.markForCheck();
  }

  private onCellDoubleClick(event: CellDoubleClickedEvent) {}
}

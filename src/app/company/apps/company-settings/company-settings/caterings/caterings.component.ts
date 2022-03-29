import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  CellDoubleClickedEvent,
  ColumnApi,
  GridApi,
  GridOptions,
  RowSelectedEvent,
} from 'ag-grid-community';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../company-settings.service';
import { ManageCateringComponent } from './manage-catering/manage-catering.component';
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
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
      },
      {
        headerName: 'Цілодобово',
        field: 'fullDay',
        cellRenderer: 'checkboxRenderer',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
      },
      {
        headerName: 'Час відкриття',
        field: 'openTime',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        valueGetter: (params) => this.getTimeString(params.data.openTime),
      },
      {
        headerName: 'Час закриття',
        field: 'closeTime',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        valueGetter: (params) => this.getTimeString(params.data.closeTime),
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-pencil"></i>`,
        onCellClicked: (params) => this.editCatering(),
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa-solid fa-gear"></i>`,
        onCellClicked: (params) => this.openManageCatering(),
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

    frameworkComponents: {
      checkboxRenderer: CheckboxCellRendererComponent,
    },

    onRowSelected: (event) => this.selectCatering(event),

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

  public editCatering() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { ...this.selectedCatering, edit: true };

    return this.dialog
      .open(NewCateringComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getCaterings();
        }
      });
  }

  public openManageCatering() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { ...this.selectedCatering };

    return this.dialog
      .open(ManageCateringComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getCaterings();
        }
      });
  }

  private async getCaterings() {
    try {
      this.caterings = await this.companySettingsService.getCatering();

      this.cdr.markForCheck();
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

  private getTimeString(time) {
    console.log(time);
    return time
      ? `${time.hour.toString().padStart(2, '0')}:${time.minute
          .toString()
          .padStart(2, '0')}`
      : '-';
  }
}

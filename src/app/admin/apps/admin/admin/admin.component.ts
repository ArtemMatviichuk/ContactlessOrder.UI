import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogClose,
  MatDialogConfig,
} from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminService } from '../admin.service';
import { ADMIN_COMPANIES_INFO } from '../constants';
import { PreviewCompanyComponent } from './preview-company/preview-company.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, OnDestroy {
  public companies = [];
  public approved = false;

  public infoText = ADMIN_COMPANIES_INFO;

  public companiesGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Організація',
        field: 'name',
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-file"></i>`,
        onCellClicked: (params) => this.previewCompany(params.data),
      },
    ],

    defaultColDef: {
      flex: 1,
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
    private dialog: MatDialog,
    private adminService: AdminService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    await this.getCompanies();
  }

  public ngOnDestroy() {}

  public onApprovedChanged() {
    this.getCompanies();
  }

  private async getCompanies() {
    try {
      this.companies = await this.adminService.getCompanies(this.approved);
      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private previewCompany(data) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.width = '600px';
    config.data = data;

    this.dialog
      .open(PreviewCompanyComponent, config)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getCompanies();
        }
      });
  }
}

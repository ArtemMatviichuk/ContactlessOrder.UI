import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogClose,
  MatDialogConfig,
} from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminNotificationService } from '../../admin-notification.service';
import { AdminService } from '../../admin.service';
import { ADMIN_COMPANIES_INFO } from '../../constants';
import { PreviewCompanyComponent } from './preview-company/preview-company.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit, OnDestroy {
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
        headerName: 'Електронна пошта',
        field: 'email',
        cellClass: 'cursor-pointer',
        onCellClicked: (params) => this.copyValue(params.data.email),
      },
      {
        headerName: 'Телефон',
        field: 'phoneNumber',
        cellClass: 'cursor-pointer',
        onCellClicked: (params) => this.copyValue(params.data.phoneNumber),
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
      event.api.getModel().getRow(event.rowIndex)?.setSelected(true, true),
  };

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private adminService: AdminService,
    private sharedService: SharedService,
    private notificationService: AdminNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    await this.getCompanies();

    this.subscribeToChanges();
  }

  public async ngOnDestroy() {}

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

    this.dialog.open(PreviewCompanyComponent, config);
  }

  private copyValue(value) {
    navigator.clipboard.writeText(value);
    this.toastr.success('Скопійовано до буферу обміну');
  }

  private subscribeToChanges() {
    this.notificationService.onCompanyAdded().subscribe((company) => {
      if (!this.approved) {
        const index = this.companies.findIndex((e) => e.id === company.id);

        if (index === -1) {
          this.companies = [company, ...this.companies];
          this.cdr.markForCheck();
        }
      }
    });

    this.notificationService.onCompanyUpdated().subscribe((company) => {
      const index = this.companies.findIndex((e) => e.id === company.id);

      if (company.approvedDate && this.approved && index === -1) {
        this.companies = [company, ...this.companies];
      } else if (company.approvedDate && this.approved) {
        this.companies.splice(index, 1, company);
      } else if (index !== -1) {
        this.companies.splice(index, 1);
      }

      setTimeout(() => {
        this.companies = [...this.companies];
        this.cdr.markForCheck();
      });
    });
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import {
  COMPLAIN_STATUSES,
  COMPLAIN_STATUS_VALUES,
  SUPPORT_COMPLAIN_TEXT,
} from '../constants';
import { SupportNotificationService } from '../support-notification.service';
import { SupportService } from '../support.service';
import { PreviewComplainComponent } from './preview-complain/preview-complain.component';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit, OnDestroy {
  public complains = [];

  public status = COMPLAIN_STATUS_VALUES.new;
  public statuses = COMPLAIN_STATUSES;

  public infoText = SUPPORT_COMPLAIN_TEXT;

  public complainsGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Користувач',
        field: 'userName',
      },
      {
        headerName: 'Email користувача',
        field: 'userEmail',
        cellClass: 'cursor-pointer',
        onCellClicked: (params) =>
          this.sharedService.copyValue(params.data.userEmail),
      },
      {
        headerName: 'Телефон користувача',
        field: 'userPhoneNumber',
        cellClass: 'cursor-pointer',
        onCellClicked: (params) =>
          this.sharedService.copyValue(params.data.userPhoneNumber),
      },
      {
        headerName: 'Компанія',
        field: 'companyName',
      },
      {
        headerName: 'Email компанії',
        field: 'companyEmail',
        onCellClicked: (params) =>
          this.sharedService.copyValue(params.data.companyEmail),
      },
      {
        headerName: 'Телефон компанії',
        field: 'companyPhoneNumber',
        onCellClicked: (params) =>
          this.sharedService.copyValue(params.data.companyPhoneNumber),
      },
      {
        headerName: 'Заклад',
        field: 'cateringName',
      },
      {
        headerName: 'Дата створення',
        field: 'createdDate',
        valueGetter: (params) =>
          this.sharedService.getDateTimeString(params.data.createdDate),
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-file"></i>`,
        onCellClicked: (params) => this.previewComplain(params.data),
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
    private notificationService: SupportNotificationService,
    private supportService: SupportService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    await this.notificationService.connect();
    this.getComplains();

    this.subscribeToChanges();
  }

  public async ngOnDestroy() {
    await this.notificationService.disconnect();
  }

  public onApprovedChanged() {
    this.getComplains();
  }

  public async getComplains() {
    try {
      this.complains = await this.supportService.getComplains(this.status);
      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private previewComplain(data) {
    const config = new MatDialogConfig();
    config.width = '600px';
    config.data = data;

    this.dialog.open(PreviewComplainComponent, config);
  }

  private subscribeToChanges() {
    this.notificationService.onComplainAdded().subscribe((complain) => {
      if (this.status === COMPLAIN_STATUS_VALUES.new) {
        const index = this.complains.findIndex((e) => e.id === complain.id);

        if (index === -1) {
          this.complains = [complain, ...this.complains];
          this.cdr.markForCheck();
        }
      }
    });

    this.notificationService.onComplainUpdated().subscribe((complain) => {
      const index = this.complains.findIndex((e) => e.id === complain.id);

      if (complain.status === this.status && index === -1) {
        this.complains = [complain, ...this.complains];
      } else if (complain.status === this.status) {
        this.complains.splice(index, 1, complain);
      } else if (index !== -1) {
        this.complains.splice(index, 1);
      }

      setTimeout(() => {
        this.complains = [...this.complains];
        this.cdr.markForCheck();
      });
    });
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { CheckboxCellRendererComponent } from 'src/app/shared/checkbox-cell-renderer/checkbox-cell-renderer.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminNotificationService } from '../../admin-notification.service';
import { AdminService } from '../../admin.service';
import { ADMIN_USERS_INFO } from '../../constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  public users = [];

  public infoText = ADMIN_USERS_INFO;

  public usersGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: `Ім'я`,
        field: 'firstName',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
      },
      {
        headerName: `Прізвище`,
        field: 'lastName',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
      },
      {
        headerName: 'Електронна пошта',
        field: 'email',
        headerClass: 'grid-header-centered',
        cellClass: ['grid-cell-centered', 'cursor-pointer'],
        onCellClicked: (params) =>
          this.sharedService.copyValue(params.data.email),
      },
      {
        headerName: 'Телефон',
        field: 'phoneNumber',
        headerClass: 'grid-header-centered',
        cellClass: ['grid-cell-centered', 'cursor-pointer'],
        onCellClicked: (params) =>
          this.sharedService.copyValue(params.data.phoneNumber),
      },
      {
        headerName: `Заблокований`,
        field: 'isBlocked',
        cellRenderer: 'checkboxRenderer',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        flex: 0,
        width: 150,
        filter: false,
        floatingFilter: false,
        suppressMenu: false,
      },
      {
        headerName: '',
        cellClass: (params) => [
          'grid-cell-centered',
          'cursor-pointer',
          params.data.isBlocked ? 'yellow-bg' : 'red-bg',
        ],
        flex: 0,
        width: 150,
        cellRenderer: (params) =>
          params.data.isBlocked ? `Розблокувати` : `Заблокувати`,
        onCellClicked: (params) => this.blockUser(params.data.id),
        filter: false,
        floatingFilter: false,
        suppressMenu: false,
      },
    ],

    defaultColDef: {
      flex: 1,

      filter: true,
      floatingFilter: true,
      suppressMenu: true,
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
      event.api.getModel().getRow(event.rowIndex)?.setSelected(true, true),
  };

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private sharedService: SharedService,
    private notificationService: AdminNotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    await this.getUsers();

    this.subscribeToChanges();
  }

  public async ngOnDestroy() {}

  public onApprovedChanged() {
    this.getUsers();
  }

  private async getUsers() {
    try {
      this.users = await this.adminService.getUsers();
      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async blockUser(id) {
    const result = await this.sharedService.openConfirmActionDialog(
      'Ви дійсно хочете заблокувати користувача?'
    );

    if (result === 'ok') {
      try {
        await this.adminService.blockUser(id);
      } catch (error) {
        this.sharedService.showRequestError(error);
      }
    }
  }

  private subscribeToChanges() {
    this.notificationService.onUserRegistered().subscribe((user) => {
      if (user.roleValue == this.adminService.roleValues.client) {
        const index = this.users.findIndex((e) => e.id === user.id);

        if (index === -1) {
          this.users = [user, ...this.users];
          this.cdr.markForCheck();
        }
      }
    });

    this.notificationService.onUserUpdated().subscribe((user) => {
      const index = this.users.findIndex((e) => e.id === user.id);

      if (index !== -1) {
        this.users.splice(index, 1, user);

        setTimeout(() => {
          this.users = [...this.users];
          this.cdr.markForCheck();
        });
      }
    });
  }
}

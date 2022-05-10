import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AdminNotificationService } from '../../admin-notification.service';
import { AdminService } from '../../admin.service';
import { ADMIN_ADMIN_INFO, ADMIN_SUPPORT_INFO } from '../../constants';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { NewUserComponent } from './new-user/new-user.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit, OnDestroy {
  public support = [];
  public admins = [];

  public supportInfoText = ADMIN_SUPPORT_INFO;
  public adminInfoText = ADMIN_ADMIN_INFO;

  public supportGridOptions: GridOptions = {
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
        headerName: 'Логін для входу',
        field: 'email',
        headerClass: 'grid-header-centered',
        cellClass: ['grid-cell-centered', 'cursor-pointer'],
        onCellClicked: (params) =>
          this.sharedService.copyValue(params.data.email),
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellClass: 'cursor-pointer',
        cellRenderer: () => `<i class="fa-solid fa-gear"></i>`,
        onCellClicked: (params) => this.openManageUser(params.data),
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
    private cdr: ChangeDetectorRef,
    private notificationService: AdminNotificationService
  ) {}

  public async ngOnInit() {
    await Promise.all([this.getAdmins(), this.getSupport()]);

    this.subscribeToChanges();

    this.cdr.markForCheck();
  }

  public ngOnDestroy() {}

  public addAdmin() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      label: 'Додати нового адміністратора',
      roleValue: this.adminService.roleValues.admin,
    };

    return this.dialog.open(NewUserComponent, dialogConfig);
  }

  public addSupport() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      label: 'Додати новий обліковий запис служби підтримки',
      roleValue: this.adminService.roleValues.support,
    };

    return this.dialog.open(NewUserComponent, dialogConfig);
  }

  private async getAdmins() {
    try {
      this.admins = await this.adminService.getAdministrators();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async getSupport() {
    try {
      this.support = await this.adminService.getSupport();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private openManageUser(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = data;

    return this.dialog.open(ManageUserComponent, dialogConfig);
  }

  private subscribeToChanges() {
    this.notificationService.onUserRegistered().subscribe((user) => {
      if (user.roleValue === this.adminService.roleValues.admin) {
        const index = this.admins.findIndex((e) => e.id === user.id);

        if (index === -1) {
          this.admins = [user, ...this.admins];
        }
      } else if (user.roleValue === this.adminService.roleValues.support) {
        const index = this.support.findIndex((e) => e.id === user.id);

        if (index === -1) {
          this.support = [user, ...this.support];
        }
      }

      this.cdr.markForCheck();
    });

    this.notificationService.onUserUpdated().subscribe((user) => {
      if (user.roleValue == this.adminService.roleValues.admin) {
        const index = this.admins.findIndex((e) => e.id === user.id);

        if (index !== -1) {
          this.admins.splice(index, 1, user);

          setTimeout(() => {
            this.admins = [...this.admins];
            this.cdr.markForCheck();
          });
        }
      } else if (user.roleValue == this.adminService.roleValues.support) {
        const index = this.support.findIndex((e) => e.id === user.id);

        if (index !== -1) {
          this.support.splice(index, 1, user);

          setTimeout(() => {
            this.support = [...this.support];
            this.cdr.markForCheck();
          });
        }
      }
    });

    this.notificationService.onUserDeleted().subscribe(id => {
      this.admins = this.admins.filter(e => e.id !== id);
      this.support = this.support.filter(e => e.id !== id);
      this.cdr.markForCheck();
    })
  }
}

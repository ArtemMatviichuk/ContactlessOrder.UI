import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CateringService } from '../catering.service';
import { ManageMenuItemComponent } from './manage-menu-item/manage-menu-item.component';
import { ManageModificationComponent } from './manage-modification/manage-modification.component';

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.scss'],
})
export class CateringComponent implements OnInit, OnDestroy {
  public menu = [];
  public menuModifications = [];
  public selectedMenuItem = null;
  public selectedMenuModification = null;

  public menuGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Опції меню',
        field: 'name',
        flex: 1,
      },
      {
        headerName: 'Цiнa',
        field: 'price',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        valueGetter: (params) => params.data.price + 'грн.',
        width: 90,
      },
      {
        headerName: 'Доступно',
        field: 'available',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        valueGetter: (params) => (params.data.available ? 'Так' : 'Ні'),
        width: 100,
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-pencil"></i>`,
        onCellClicked: (params) => this.editMenuItem(),
      },
    ],

    defaultColDef: {
      tooltipValueGetter: (params) => params.value,
      cellStyle: (params) => {
        const style = {
          overflow:
            params.colDef.field === 'firstPictureUrl' ? 'visible' : null,
        };

        return style;
      },
    },

    rowSelection: 'single',
    enableBrowserTooltips: true,

    getRowId: (data) => data.data.id,

    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    suppressRowTransform: true,

    onRowSelected: (event) => this.selectMenuItem(event),

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  public modificationsGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Добавки',
        field: 'name',
        flex: 1,
      },
      {
        headerName: 'Цiнa',
        field: 'price',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        valueGetter: (params) => params.data.price + 'грн.',
        width: 90,
      },
      {
        headerName: 'Доступно',
        field: 'available',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        valueGetter: (params) => (params.data.available ? 'Так' : 'Ні'),
        width: 100,
      },
      {
        headerName: '',
        width: 50,
        cellRenderer: () => `<i class="fa fa-pencil"></i>`,
        onCellClicked: (params) => this.editModifications(),
      },
    ],

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

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dialog: MatDialog,
    private cateringService: CateringService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    this.getMenu();
    this.getModifications();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private async getMenu() {
    try {
      this.menu = await this.cateringService.getMenu();

      if (this.selectedMenuItem) {
        this.selectedMenuItem = this.menu.find(
          (e) => e.id === this.selectedMenuItem.id
        );
      }

      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async getModifications() {
    try {
      this.menuModifications = await this.cateringService.getModifications();

      if (this.selectedMenuModification) {
        this.selectedMenuModification = this.menuModifications.find(
          (e) => e.id === this.selectedMenuModification.id
        );
      }

      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private selectMenuItem(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedMenuItem = event.data;

    this.cdr.markForCheck();
  }

  private selectModification(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedMenuModification = event.data;

    this.cdr.markForCheck();
  }

  public editMenuItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { ...this.selectedMenuItem, edit: true };

    return this.dialog
      .open(ManageMenuItemComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getMenu();
        }
      });
  }

  public editModifications() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { ...this.selectedMenuModification, edit: true };

    return this.dialog
      .open(ManageModificationComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getModifications();
        }
      });
  }
}

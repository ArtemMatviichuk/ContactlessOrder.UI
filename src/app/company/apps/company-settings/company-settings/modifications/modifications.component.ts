import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';
import { ImageCellRendererComponent } from 'src/app/shared/image-cell-renderer/image-cell-renderer.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../company-settings.service';
import { COMPANY_MODIFICATIONS_INFO } from '../../constants';
import { ChangeModificationComponent } from './change-modification/change-modification.component';
import { NewModificationComponent } from './new-modification/new-modification.component';

@Component({
  selector: 'app-modifications',
  templateUrl: './modifications.component.html',
  styleUrls: ['./modifications.component.scss'],
})
export class ModificationsComponent implements OnInit {
  public modifications = [];
  public selectedModification = null;

  public infoText = COMPANY_MODIFICATIONS_INFO;

  public modificationsGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Добавки',
        field: 'name',
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-pencil"></i>`,
        onCellClicked: (params) => this.editModification(),
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

    frameworkComponents: {
      imageComponent: ImageCellRendererComponent,
    },

    getRowId: (data) => data.data.id,

    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    suppressRowTransform: true,

    onRowSelected: (event) => this.selectModification(event),

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  constructor(
    private dialog: MatDialog,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.getModifications();
  }

  public addModification() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { add: true };

    return this.dialog
      .open(NewModificationComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getModifications();
        }
      });
  }

  public editModification() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { ...this.selectedModification };

    return this.dialog
      .open(ChangeModificationComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getModifications();
        }
      });
  }

  public async deleteModification() {
    const result = await this.sharedService.openConfirmDeleteDialog(
      'Ви впевнені, що хочете ВИДАЛИТИ цю опцію з УСІХ меню?'
    );

    if (result !== 'delete') {
      return;
    }

    try {
      await this.companySettingsService.deleteModification(
        this.selectedModification.id
      );

      this.getModifications();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async getModifications() {
    try {
      this.modifications = await this.companySettingsService.getModifications();

      if (this.selectedModification) {
        this.selectedModification = this.modifications.find(
          (e) => e.id === this.selectedModification.id
        );
      }

      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private selectModification(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedModification = event.data;

    this.cdr.markForCheck();
  }
}

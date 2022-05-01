import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { ImageCellRendererComponent } from 'src/app/shared/image-cell-renderer/image-cell-renderer.component';
import { ImageGalleryComponent } from 'src/app/shared/image-gallery/image-gallery.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../company-settings.service';
import { COMPANY_MENU_INFO } from '../../constants';
import { NewMenuItemComponent } from './new-menu-item/new-menu-item.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public menuItems = [];
  public selectedMenuItem = null;
  
  public infoText = COMPANY_MENU_INFO;

  public menuGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: 'Опції меню',
        field: 'name',
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-pencil"></i>`,
        onCellClicked: (params) => this.editMenuItem(),
      },
      {
        headerName: '',
        flex: 0,
        width: 50,
        cellRenderer: () => `<i class="fa fa-trash"></i>`,
        onCellClicked: (params) => this.deleteMenuItem(),
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

    onRowSelected: (event) => this.selectMenuItem(event),

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
    this.getMenu();
  }

  public addMenuItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { add: true };

    return this.dialog
      .open(NewMenuItemComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getMenu();
        }
      });
  }

  public editMenuItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { ...this.selectedMenuItem, edit: true };

    return this.dialog
      .open(NewMenuItemComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getMenu();
        }
      });
  }

  public async deleteMenuItem() {
    const result = await this.sharedService.openConfirmDeleteDialog(
      'Ви впевнені, що хочете ВИДАЛИТИ цю опцію з УСІХ меню?'
    );

    if (result !== 'delete') {
      return;
    }

    try {
      await this.companySettingsService.deleteMenuItem(
        this.selectedMenuItem.id
      );
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private async getMenu() {
    try {
      const menuItems = await this.companySettingsService.getMenu();

      menuItems.forEach((e) => {
        e.firstPictureUrl = e.firstPictureId
          ? this.companySettingsService.getMenuItemPictureUrl(e.firstPictureId)
          : PLACEHOLDER_IMAGE;
      });

      this.menuItems = menuItems;

      if (this.selectedMenuItem) {
        this.selectedMenuItem = this.menuItems.find(
          (e) => e.id === this.selectedMenuItem.id
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

  private async openPictureGallery() {
    const pictures = await this.getPictures();

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "900px";
    dialogConfig.data = { pictures };

    this.dialog.open(ImageGalleryComponent, dialogConfig);
  }

  private async getPictures() {
    try {
      const pictures = await this.companySettingsService.getMenuItemPictures(
        this.selectedMenuItem.id
      );

      return pictures.map((i) => ({
        fileName: i.fileName,
        url: this.companySettingsService.getMenuItemPictureUrl(i.id),
        id: i.id,
      }));
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

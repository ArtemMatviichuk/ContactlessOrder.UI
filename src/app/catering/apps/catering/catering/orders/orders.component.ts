import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CateringService } from '../../catering.service';
import { PreviewOrderComponent } from './preview-order/preview-order.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  public orders = [];
  public selectedOrder = null;

  public ordersGridOptions: GridOptions = {
    columnDefs: [
      {
        headerName: '№ Замовлення',
        field: 'number',
      },
      {
        headerName: 'Загальна вартість',
        field: 'totalPrice',
        valueGetter: (params) => params.data.totalPrice + 'грн.',
      },
      {
        headerName: 'Статус',
        field: 'statusName',
      },
      {
        headerName: 'Деталі замовлення',
        headerClass: 'grid-header-centered',
        cellClass: 'grid-cell-centered',
        cellRenderer: () => `<i class="fa fa-print"></i>`,
        onCellClicked: (params) => this.previewOrder(),
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

    getRowId: (data) => data.data.id,

    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    suppressRowTransform: true,

    onRowSelected: (event) => this.selectOrder(event),

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dialog: MatDialog,
    private cateringService: CateringService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    this.getMenu();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private async getMenu() {
    try {
      this.orders = await this.cateringService.getOrders();

      if (this.selectedOrder) {
        this.selectedOrder = this.orders.find(
          (e) => e.id === this.selectedOrder.id
        );
      }

      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private selectOrder(event: RowSelectedEvent) {
    if (!event.node.isSelected()) {
      return;
    }

    this.selectedOrder = event.data;

    this.cdr.markForCheck();
  }

  public previewOrder() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { ...this.selectedOrder };

    return this.dialog
      .open(PreviewOrderComponent, dialogConfig)
      .afterClosed()
      .subscribe((result) => {
        if (result?.success) {
          this.getMenu();
        }
      });
  }
}

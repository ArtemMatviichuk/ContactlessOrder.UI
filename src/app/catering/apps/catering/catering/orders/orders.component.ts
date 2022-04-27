import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GridOptions, RowSelectedEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ORDER_STATUS_VALUES } from 'src/app/shared/constants/values';
import { SelectCellEditorComponent } from 'src/app/shared/select-cell-editor/select-cell-editor.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CateringNotificationService } from '../../catering-notification.service';
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
        field: 'statusId',
        cellEditor: 'selectEditor',
        cellEditorParams: () => ({
          bindValue: 'id',
          bindLabel: 'name',
          values: this.orderStatuses,
          onSelect: () => this.ordersGridOptions.api.stopEditing(),
        }),
        valueFormatter: (params) => params.data.statusName,
        tooltipValueGetter: (params) => params.data.statusName,
        getQuickFilterText: (params) => params.data.statusName,
        filterValueGetter: (params) => params.data.statusName,
        editable: (params) =>
          params.data.statusValue !== ORDER_STATUS_VALUES.done &&
          params.data.statusValue !== ORDER_STATUS_VALUES.ready &&
          params.data.statusValue !== ORDER_STATUS_VALUES.rejected,
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

    frameworkComponents: {
      selectEditor: SelectCellEditorComponent,
    },

    rowSelection: 'single',
    enableBrowserTooltips: true,

    getRowId: (data) => data.data.id,

    singleClickEdit: true,
    stopEditingWhenCellsLoseFocus: true,
    suppressRowTransform: true,

    onRowSelected: (event) => this.selectOrder(event),
    onCellEditingStopped: (event) => this.updateOrderStatus(event),

    onCellFocused: (event) =>
      event.api.getModel().getRow(event.rowIndex).setSelected(true, true),
  };

  private orderStatuses = [];

  private onDestroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private cateringService: CateringService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private notificationService: CateringNotificationService,
    private toastrService: ToastrService
  ) {}

  public async ngOnInit() {
    await Promise.all([this.getMenu(), this.getStatuses()]);

    this.subscribeToChanges();
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

  private async getStatuses() {
    try {
      const orderStatuses = await this.cateringService.getOrderStatuses();
      this.orderStatuses = orderStatuses.filter(
        (e) =>
          e.value === ORDER_STATUS_VALUES.inProgress ||
          e.value === ORDER_STATUS_VALUES.ready ||
          e.value === ORDER_STATUS_VALUES.onHold
      );
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

  private async updateOrderStatus(event) {
    try {
      await this.cateringService.updateOrderStatus(event.data.id, event.value);
      this.getMenu();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
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

  private subscribeToChanges() {
    this.notificationService.onOrderPaid().subscribe((dto) => {
      if (!this.orders.find((e) => e.id === dto.id)) {
        this.toastrService.success(dto.number, 'Нове замовлення');
        this.sharedService.playNotificationSound();
        
        this.orders = [dto, ...this.orders.filter((e) => e.id !== dto.id)];
        this.cdr.markForCheck();
      }
    });
  }
}

import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgSelectComponent } from "@ng-select/ng-select";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { ICellEditorParams } from "ag-grid-community";

@Component({
  selector: "app-select-cell-editor",
  templateUrl: "./select-cell-editor.component.html",
  styleUrls: ["./select-cell-editor.component.scss"],
})
export class SelectCellEditorComponent implements ICellEditorAngularComp, AfterViewInit {
  @ViewChild(NgSelectComponent) select: NgSelectComponent;

  public items: string[];

  public selectedItem: string;

  public params;

  agInit(params: ICellEditorParams): void {
    this.params = params;
    this.setInitialState(this.params);
  }

  setInitialState(params: any) {
    this.selectedItem = params.value;

    this.items = params.values;
  }

  getValue(): any {
    return this.selectedItem;
  }

  isCancelBeforeStart(): boolean {
    return false;
  }

  focusIn() {
    this.select.focus();
  }

  ngAfterViewInit() {
    if (this.params.cellStartedEdit) {
      window.setTimeout(() => {
        this.select.open();

        this.select.focus();
      });
    }
  }

  keyDownFn = (event) => {
    if (this.params.keyDownFn) {
      this.params.keyDownFn(event);
    }

    return true;
  }
}

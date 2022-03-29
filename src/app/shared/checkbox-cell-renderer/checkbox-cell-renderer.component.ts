import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatCheckbox } from "@angular/material/checkbox";
import { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-checkbox-cell-renderer",
  templateUrl: "./checkbox-cell-renderer.component.html",
  styleUrls: ["./checkbox-cell-renderer.component.scss"],
})
export class CheckboxCellRendererComponent implements ICellRendererComp {
  @ViewChild(MatCheckbox) checkboxElement: ElementRef;

  public value: boolean;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: any): boolean {
    this.value = params.value;

    return true;
  }

  getGui(): HTMLElement {
    return this.checkboxElement.nativeElement;
  }
}

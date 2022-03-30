import { Component, ElementRef, ViewChild } from "@angular/core";
import { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

@Component({
  selector: "app-image-cell-renderer",
  templateUrl: "./image-cell-renderer.component.html",
  styleUrls: ["./image-cell-renderer.component.scss"],
})
export class ImageCellRendererComponent implements ICellRendererComp {
  @ViewChild("imageElement") imageElement: ElementRef<HTMLImageElement>;

  public imageUrl: string;

  public params;

  agInit(params: ICellRendererParams): void {
    this.imageUrl = params.value;
    this.params = params;
  }

  refresh(params: any): boolean {
    this.imageUrl = params.value;
    this.params = params;

    return true;
  }

  getGui(): HTMLElement {
    return this.imageElement.nativeElement;
  }
}

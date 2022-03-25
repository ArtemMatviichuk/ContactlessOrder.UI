import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

@Component({
  selector: "app-modal-template",
  templateUrl: "./modal-template.component.html",
  styleUrls: ["./modal-template.component.scss"],
})
export class ModalTemplateComponent implements OnInit {
  public safeHtml: SafeHtml;
  constructor(
    private dialogRef: MatDialogRef<ModalTemplateComponent>,
    public sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public requestData
  ) {
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(requestData.template);
  }

  ngOnInit() {}

  public success() {
    this.dialogRef.close();
  }
}

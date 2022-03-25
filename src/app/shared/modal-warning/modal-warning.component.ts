import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-modal-confirm",
  templateUrl: "./modal-warning.component.html",
  styleUrls: ["./modal-warning.component.scss"],
})
export class ModalWarningComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ModalWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public requestData
  ) {}

  ngOnInit() {}

  public success() {
    this.dialogRef.close();
  }
}

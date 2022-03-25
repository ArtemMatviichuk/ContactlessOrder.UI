import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-modal-confirm",
  templateUrl: "./modal-confirm.component.html",
  styleUrls: ["./modal-confirm.component.scss"],
})
export class ModalConfirmComponent implements OnInit {
  public message = null;
  constructor(
    private dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public requestData
  ) {
    this.message = requestData.message;
  }

  ngOnInit() {}

  public cancel() {
    this.dialogRef.close("cancel");
  }

  public success() {
    this.dialogRef.close("ok");
  }
}

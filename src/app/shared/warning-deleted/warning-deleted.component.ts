import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-warning-deleted",
  templateUrl: "./warning-deleted.component.html",
  styleUrls: ["./warning-deleted.component.scss"],
})
export class WarningDeletedComponent implements OnInit {
  message = "Are you sure you want to DELETE selected record?";
  constructor(
    private dialogRef: MatDialogRef<WarningDeletedComponent>,
    @Inject(MAT_DIALOG_DATA) public requestData
  ) {
    if (this.requestData && this.requestData.message) {
      this.message = this.requestData.message;
    }
  }

  ngOnInit() {}

  /**
   * Close dialog
   */
  public close() {
    this.dialogRef.close();
  }

  /**
   * Close dialog
   */
  public success() {
    this.dialogRef.close("delete");
  }
}

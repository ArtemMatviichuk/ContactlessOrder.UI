import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { SharedService } from "src/app/shared/services/shared.service";
import { ImageGalleryComponent } from "../image-gallery/image-gallery.component";

export class PicturesSelectorOptions {
  add: boolean;
  edit: boolean;
  preview: boolean;
  borrowedPictureText?: string;
  pictureSize?: string = "32px";
  enlargeable?: boolean = false;
  loadPicturesAsync: () => Promise<any[]>;
  getPictureUrl?: (id: number) => string;
}

@Component({
  selector: "app-pictures-selector",
  templateUrl: "./pictures.component.html",
  styleUrls: ["./pictures.component.scss"],
})
export class PicturesSelectorComponent implements OnInit {
  @Input() data: PicturesSelectorOptions;

  public selectedPicture: any;
  public pictures = [];

  public changes = false;

  private deletedPictureIds = [];

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {
    if (!this.data.add) {
      this.getPictures();
    }
  }

  public getUploadedPictureFiles() {
    return this.pictures.filter((p) => p.file && !p.id).map((p) => p.file);
  }

  public getDeletedPictureIds() {
    return this.deletedPictureIds;
  }

  public async addPictures(event) {
    const files: File[] = [...event.target.files];

    const newPictures = files.map((f) => ({
      fileName: f.name,
      url: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(f)),
      file: f,
    }));

    if (newPictures.length != null) {
      this.changes = true;
    }

    this.pictures = [...this.pictures, ...newPictures];
  }

  public async deletePicture() {
    const result = await this.sharedService.openConfirmDeleteDialog();

    if (result === "delete") {
      this.changes = true;

      if (this.selectedPicture.id) {
        this.deletedPictureIds.push(this.selectedPicture.id);
      }

      this.pictures = this.pictures.filter((p) => p !== this.selectedPicture);

      this.selectedPicture = null;

      this.cdr.markForCheck();
    }
  }

  public reloadInventoryPictures(pictures) {
    this.selectedPicture = null;
    this.pictures = [
      ...this.pictures.filter((e) => !e.borrowed),
      ...pictures.map((p) => ({
        ...p,
        url: this.data.getPictureUrl(p.id),
        borrowed: true,
      })),
    ];
  }

  public async openGallery() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "900px";
    dialogConfig.data = { pictures: this.pictures };

    this.dialog.open(ImageGalleryComponent, dialogConfig);
  }

  private async getPictures() {
    try {
      this.pictures = await this.data.loadPicturesAsync();

      this.cdr.markForCheck();
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }
}

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  NgxGalleryComponent,
  NgxGalleryImageSize,
  NgxGalleryOptions,
} from "@kolkov/ngx-gallery";

@Component({
  selector: "app-image-gallery-dialog",
  templateUrl: "./image-gallery.component.html",
  styleUrls: ["./image-gallery.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGalleryComponent implements OnInit {
  @ViewChild(NgxGalleryComponent) gallery: NgxGalleryComponent;

  public selectedImage;

  public galleryOptions: NgxGalleryOptions[] = [
    {
      width: "100%",
      imageSize: NgxGalleryImageSize.Contain,
      imageArrowsAutoHide: true,
      thumbnailsArrowsAutoHide: true,
      preview: false,
      imagePercent: 80,
      thumbnailsPercent: 20,
      thumbnailsMoveSize: 4,
      thumbnailSize: NgxGalleryImageSize.Contain,
      startIndex: this.dialogData.selectedIndex ?? 0
    },
  ];
  public galleryImages = [];

  constructor(
    private dialogRef: MatDialogRef<ImageGalleryComponent>,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public dialogData
  ) {}

  async ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());

    this.setData();
  }

  public selectImage(event) {
    this.selectedImage = this.galleryImages[event.index];
  }

  public async close() {
    this.dialogRef.close();
  }

  private setData() {
    this.galleryImages = this.dialogData.pictures.map((p) => ({
      id: p.id,
      small: p.url,
      medium: p.url,
      big: p.url,
      fileName: p.fileName,
    }));

    this.cdr.markForCheck();
  }
}

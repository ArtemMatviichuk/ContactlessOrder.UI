import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CateringService } from '../../../catering.service';

@Component({
  selector: 'app-preview-order',
  templateUrl: './preview-order.component.html',
  styleUrls: ['./preview-order.component.scss'],
})
export class PreviewOrderComponent implements OnInit, OnDestroy {
  constructor(private cateringService: CateringService, private sharedService: SharedService, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  public getPositionImage(id) {
    return id
      ? this.cateringService.getMenuItemPictureUrl(id)
      : PLACEHOLDER_IMAGE;
  }

  public getDateTime(value) {
    return this.sharedService.getDateTimeString(value);
  }
}

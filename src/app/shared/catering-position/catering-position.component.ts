import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientService } from 'src/app/client/client/client.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-catering-position',
  templateUrl: './catering-position.component.html',
  styleUrls: ['./catering-position.component.scss'],
})
export class CateringPositionComponent implements AfterViewInit {
  @ViewChild('map') mapElement: any;
  map: google.maps.Map;

  private point = null;
  private catering;

  constructor(
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngAfterViewInit() {
    this.catering = this.dialogData.catering;

    setTimeout(async () => this.setUpMap());
  }

  private setUpMap() {
    const mapProperties: any = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: new google.maps.LatLng(this.catering.coordinates),
    };

    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );

    this.point = new google.maps.Marker({
      position: this.catering.coordinates,
      map: this.map,
      title: this.catering.name,
    });
  }
}

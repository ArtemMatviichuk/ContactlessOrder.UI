import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {} from 'googlemaps';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  @ViewChild('map') mapElement: any;
  map: google.maps.Map;

  public selectedPoint = null;
  private points = [];
  private caterings = [];

  constructor(
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private clientService: ClientService
  ) {
    this.loadCaterings = this.loadCaterings.bind(this);
    this.selectPoint = this.selectPoint.bind(this);
  }

  async ngOnInit() {
    this.sharedService.appsPreload = true;

    this.sharedService.appsPreload = false;

    this.cdr.markForCheck();
  }

  public ngAfterViewInit() {
    this.setUpMap();
  }

  private setUpMap() {
    const mapProperties: any = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          mapProperties.center = new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          this.map = new google.maps.Map(
            this.mapElement.nativeElement,
            mapProperties
          );

          this.map.addListener('center_changed', this.loadCaterings);
          setTimeout(() => this.loadCaterings(), 100);
        },
        () => this.setDefaultMap(mapProperties),
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
      );
    } else {
      this.setDefaultMap(mapProperties);
    }
  }

  private async setDefaultMap(mapProperties) {
    mapProperties.center = new google.maps.LatLng(
      50.449914706977005,
      30.5250084400177
    );

    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );

    this.map.addListener('center_changed', this.loadCaterings);
    setTimeout(() => this.loadCaterings(), 100);
  }

  private async loadCaterings() {
    try {
      const caterings = await this.clientService.getCaterings(
        this.map.getBounds().getSouthWest(),
        this.map.getBounds().getNorthEast()
      );

      this.caterings = caterings;
      this.points = caterings.map((e) => {
        const point = new google.maps.Marker({
          position: e.coordinates,
          map: this.map,
          title: e.label,
        });

        point.addListener('click', this.selectPoint);
        return point;
      });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  private selectPoint(event) {
    this.selectedPoint = this.caterings.find(
      (e) =>
        e.coordinates.lat === event.latLng.lat() &&
        e.coordinates.lng === event.latLng.lng()
    );

    this.cdr.markForCheck();
  }
}

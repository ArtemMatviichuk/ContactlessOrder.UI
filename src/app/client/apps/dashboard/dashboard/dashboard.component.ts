import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {} from 'googlemaps';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  @ViewChild('map') mapElement: any;
  map: google.maps.Map;

  public allowed: any[];
  public notAllowed: any[];

  constructor(
    public sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.sharedService.appsPreload = true;

    this.allowed = [];
    this.notAllowed = [];

    this.sharedService.appsPreload = false;

    this.cdr.markForCheck();
  }

  public ngAfterViewInit() {
    this.setUpMap();
  }

  private setUpMap() {
    const mapProperties = {
      center: new google.maps.LatLng(50.4270314, 30.4721387),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );
  }
}

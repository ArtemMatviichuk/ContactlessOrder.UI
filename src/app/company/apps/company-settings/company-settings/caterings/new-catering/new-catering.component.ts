import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanySettingsService } from '../../../company-settings.service';

@Component({
  selector: 'app-new-catering',
  templateUrl: './new-catering.component.html',
  styleUrls: ['./new-catering.component.scss'],
})
export class NewCateringComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElement: any;
  map: google.maps.Map;

  public form: FormGroup;
  public point: google.maps.Marker;

  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<NewCateringComponent>,
    private companySettingsService: CompanySettingsService,
    private sharedService: SharedService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {
    this.selectPoint = this.selectPoint.bind(this);
    this.form = fb.group({
      name: [null, Validators.required],
      services: [null, Validators.required],
      fullDay: [false],
      openTime: [{ hour: 9, minute: 0 }, Validators.required],
      closeTime: [{ hour: 18, minute: 0 }, Validators.required],
    });
  }

  public ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(() => this.close());
    this.sharedService.validateFormFields(this.form);

    this.setData();

    this.subscribeToChanges();
  }

  public ngAfterViewInit(): void {
    this.setMap();
  }

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  public getTitle() {
    if (this.dialogData.add) {
      return "Додати точку громадського харчування";
    } else {
      return "Змінити точку громадського харчування";
    }
  }

  public async save() {
    if (!this.point) {
      this.sharedService.showTemplate('<p>Виберіть місце на карті</p>');
      return;
    }

    const formValue = this.form.value;
    const data = {
      ...formValue,
      coordinates: this.point.getPosition().toJSON(),
    };

    try {
      if (this.dialogData.add) {
        var loginData = await this.companySettingsService.createCatering(data);
        this.sharedService.showTemplate(
          this.getPasswordTemplate(loginData),
          '450px'
        );
      } else {
        await this.companySettingsService.updateCatering(
          this.dialogData.id,
          data
        );
      }

      this.dialogRef.close({ success: true });
    } catch (error) {
      this.sharedService.showRequestError(error);
    }
  }

  public async close() {
    if (this.form.dirty) {
      const result = await this.sharedService.openConfirmActionDialog(
        'Discard changes'
      );

      if (result !== 'ok') return;
    }

    this.dialogRef.close({ success: false });
  }

  private setData() {
    if (!this.dialogData.add) {
      this.form.patchValue(this.dialogData);

      if (this.dialogData.fullDay) {
        this.form.controls.openTime.disable();
        this.form.controls.closeTime.disable();
      }
    }
  }

  private setMap() {
    const mapProperties: any = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    if (!this.dialogData.add) {
      mapProperties.center = new google.maps.LatLng(
        this.dialogData.coordinates
      );

      this.map = new google.maps.Map(
        this.mapElement.nativeElement,
        mapProperties
      );

      this.point = new google.maps.Marker({
        position: this.dialogData.coordinates,
        map: this.map,
        title: 'Місцезнаходження вашого бізнесу',
      });

      this.map.addListener('click', this.selectPoint);
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            mapProperties.center = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude
            );

            this.map = new google.maps.Map(
              this.mapElement.nativeElement,
              mapProperties
            );

            this.map.addListener('click', this.selectPoint);
          },
          () => this.setDefaultMap(mapProperties),
          { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true }
        );
      } else {
        this.setDefaultMap(mapProperties);
      }
    }
  }

  private setDefaultMap(mapProperties) {
    mapProperties.center = new google.maps.LatLng(
      50.449914706977005,
      30.5250084400177
    );
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      mapProperties
    );

    this.map.addListener('click', this.selectPoint);
  }

  private selectPoint(event: google.maps.MapMouseEvent) {
    const myLatLng = event.latLng;

    this.map.setCenter(myLatLng);

    if (!this.point) {
      this.point = new google.maps.Marker({
        position: myLatLng,
        map: this.map,
        title: 'Місцезнаходження вашого бізнесу',
      });
    } else {
      this.point.setPosition(myLatLng);
    }
  }

  private getPasswordTemplate(loginData) {
    return `<p>ЗАПИШІТЬ ЦЮ ІНФОРМАЦІЮ</p>
    <p>Для входу під аккаунтом цієї точки:</p>
    <p>Логін: ${loginData.email}</p>
    <p>Пароль: ${loginData.password}</p>
    `;
  }

  private subscribeToChanges() {
    this.form.controls.fullDay.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value) {
          this.form.controls.openTime.patchValue(null);
          this.form.controls.closeTime.patchValue(null);

          this.form.controls.openTime.disable();
          this.form.controls.closeTime.disable();
        } else {
          this.form.controls.openTime.patchValue(this.dialogData.openTime);
          this.form.controls.closeTime.patchValue(this.dialogData.closeTime);

          this.form.controls.openTime.enable();
          this.form.controls.closeTime.enable();
        }
      });
  }
}

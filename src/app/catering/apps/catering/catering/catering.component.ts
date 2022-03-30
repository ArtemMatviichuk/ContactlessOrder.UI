import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { PLACEHOLDER_IMAGE } from 'src/app/shared/constants/images';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CateringService } from '../catering.service';

@Component({
  selector: 'app-catering',
  templateUrl: './catering.component.html',
  styleUrls: ['./catering.component.scss'],
})
export class CateringComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private companySettingsService: CateringService,
    private sanitizer: DomSanitizer,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

  public async ngOnInit() {}

  public ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

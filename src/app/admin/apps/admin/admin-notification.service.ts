import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NOTIFICATION_SOUND } from 'src/app/shared/constants/sounds';
import { SignalrService } from 'src/app/shared/services/signalr.service';
import { Howl } from 'howler';

@Injectable()
export class AdminNotificationService extends SignalrService {
  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super('admin', _router, _http);
  }

  protected registerMethods(): void {}
}

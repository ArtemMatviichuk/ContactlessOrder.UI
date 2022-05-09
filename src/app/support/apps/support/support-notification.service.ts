import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SignalrService } from 'src/app/shared/services/signalr.service';

@Injectable()
export class SupportNotificationService extends SignalrService {
  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super('support', _router, _http);
  }

  protected registerMethods(): void {}
}

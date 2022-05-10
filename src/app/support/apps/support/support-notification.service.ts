import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SignalrService } from 'src/app/shared/services/signalr.service';

@Injectable()
export class SupportNotificationService extends SignalrService {
  private complainAdded = new Subject<any>();
  public onComplainAdded = (): Observable<any> => this.complainAdded;
  
  private complainUpdated = new Subject<any>();
  public onComplainUpdated = (): Observable<any> => this.complainUpdated;

  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super('support', _router, _http);
  }

  protected registerMethods(): void {
    this.connection.on('ComplainAdded', (complain) => this.complainAdded.next(complain));
    this.connection.on('ComplainUpdated', (complain) => this.complainUpdated.next(complain));
  }
}

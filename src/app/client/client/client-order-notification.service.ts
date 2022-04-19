import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SignalrService } from 'src/app/shared/services/signalr.service';

@Injectable()
export class ClientOrderNotificationService extends SignalrService {
  private orderUpdated = new Subject<any>();
  public onOrderUpdated = (): Observable<any> => this.orderUpdated;

  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super('orders', _router, _http);
  }

  protected registerMethods(): void {
    this.connection.on('OrderUpdated', (order) => this.orderUpdated.next(order));
  }
}

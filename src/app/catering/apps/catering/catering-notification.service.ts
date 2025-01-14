import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { NOTIFICATION_SOUND } from 'src/app/shared/constants/sounds';
import { SignalrService } from 'src/app/shared/services/signalr.service';
import { Howl } from 'howler'

@Injectable()
export class CateringNotificationService extends SignalrService {
  private orderUpdated = new Subject<any>();
  public onOrderUpdated = (): Observable<any> => this.orderUpdated;

  private orderPaid = new Subject<any>();
  public onOrderPaid = (): Observable<any> => this.orderPaid;
  
  private orderRejected = new Subject<any>();
  public onOrderRejected = (): Observable<any> => this.orderRejected;
  
  private orderCompleted = new Subject<any>();
  public onOrderCompleted = (): Observable<any> => this.orderCompleted;

  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super('orders', _router, _http);
  }

  protected registerMethods(): void {
    this.connection.on('OrderUpdated', (order) => this.orderUpdated.next(order));
    this.connection.on('OrderPaid', (order) => this.orderPaid.next(order));
    this.connection.on('OrderRejected', (order) => this.orderRejected.next(order));
    this.connection.on('OrderCompleted', (order) => this.orderCompleted.next(order));
  }
}

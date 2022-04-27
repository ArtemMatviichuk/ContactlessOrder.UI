import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClientSharedService } from '../../client/client-shared.service';

@Component({
  selector: 'app-order-ready',
  templateUrl: './order-ready.component.html',
  styleUrls: ['./order-ready.component.scss'],
})
export class OrderReadyComponent implements OnInit, OnDestroy {
  public number = null;

  constructor(private clientSharedService: ClientSharedService) {}

  public ngOnInit() {
    this.number = this.clientSharedService.readyOrders.pop();
    //add noise
  }

  public ngOnDestroy() {}
}

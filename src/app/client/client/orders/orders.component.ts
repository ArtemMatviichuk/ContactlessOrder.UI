import { Component, OnInit } from "@angular/core";
import { ClientService } from "../client.service";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss'],
  })
  export class OrdersComponent implements OnInit {
    constructor(private clientService: ClientService) {}

    public ngOnInit(): void {
      this.clientService.getOrders();
    }
  }
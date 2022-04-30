import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { serialize } from 'object-to-formdata';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CateringService extends AuthService {
  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super(_router, _http);
  }

  public getMenu(): Promise<any[]> {
    return this._http.get<any[]>(`${this.url}/api/Caterings/Menu`).toPromise();
  }

  public updateMenuOption(id: any, formValue: any) {
    return this._http
      .put<void>(`${this.url}/api/Caterings/Menu/${id}`, formValue)
      .toPromise();
  }

  public getOrders(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Caterings/Orders`)
      .toPromise();
  }
  
  public getEndedOrder(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Caterings/EndedOrders`)
      .toPromise();
  }

  public getMenuItemPictureUrl(id: any) {
    return `${this.url}/api/Companies/Menu/Pictures/${id}/File`;
  }

  public getModifications(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Caterings/Modifications`)
      .toPromise();
  }

  public updateModification(id: any, formValue: any) {
    return this._http
      .put<void>(`${this.url}/api/Caterings/Modifications/${id}`, formValue)
      .toPromise();
  }

  public getOrderStatuses(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Caterings/OrderStatuses`)
      .toPromise();
  }

  public updateOrderStatus(orderId: any, statusId: any) {
    return this._http
      .put<void>(`${this.url}/api/Caterings/Orders/${orderId}/Status`, {
        value: statusId,
      })
      .toPromise();
  }
}

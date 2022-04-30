import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class ClientService extends AuthService {
  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super(_router, _http);
  }

  public getCaterings(from, to, search) {
    var params = new HttpParams();

    params = params.append('from.lat', from.lat());
    params = params.append('from.lng', from.lng());
    params = params.append('to.lat', to.lat());
    params = params.append('to.lng', to.lng());

    params = params.append('search', search);

    return this._http
      .get<any[]>(`${this.url}/api/Client/Caterings`, { params })
      .toPromise();
  }

  public getCatering(orderId: any) {
    return this._http
      .get<any[]>(`${this.url}/api/Client/Caterings/${orderId}`)
      .toPromise();
  }

  public getMenu(id: any): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Client/Caterings/${id}/Menu`)
      .toPromise();
  }

  public getOptionPictures(id: any) {
    return this._http
      .get<any[]>(`${this.url}/api/Client/Menu/${id}/Pictures`)
      .toPromise();
  }

  public getMenuItemPictureUrl(id: any) {
    return `${this.url}/api/Companies/Menu/Pictures/${id}/File`;
  }

  public getOptions(optionIds: any[]) {
    let params = new HttpParams();

    optionIds.forEach((e, i) => {
      params = params.append(`value[${i}].id`, e.id);
      params = params.append(`value[${i}].cateringId`, e.cateringId);
    });

    return this._http
      .get<any[]>(`${this.url}/api/Client/Cart`, { params })
      .toPromise();
  }

  public getOrders() {
    return this._http.get<any[]>(`${this.url}/api/Client/Order`).toPromise();
  }

  public createOrder(data) {
    return this._http
      .post<number>(`${this.url}/api/Client/Order`, data)
      .toPromise();
  }

  public orderPaid(data) {
    return this._http
      .put<void>(`${this.url}/api/Client/Order`, data)
      .toPromise();
  }

  public rejectOrder(id: any) {
    return this._http
      .put<void>(`${this.url}/api/Client/Order/${id}/Reject`, {})
      .toPromise();
  }
  
  public completeOrder(id: any) {
    return this._http
      .put<void>(`${this.url}/api/Client/Order/${id}/Complete`, {})
      .toPromise();
  }

  public getTotalPrice(orderId: number): any {
    return this._http
      .get<number>(`${this.url}/api/Client/Order/${orderId}/TotalPrice`)
      .toPromise();
  }

  public getPaymentMethods(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Client/PaymentMethods`)
      .toPromise();
  }
}

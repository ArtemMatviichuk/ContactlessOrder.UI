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

  public getCaterings(from, to) {
    var params = new HttpParams();

    params = params.append('from.lat', from.lat());
    params = params.append('from.lng', from.lng());
    params = params.append('to.lat', to.lat());
    params = params.append('to.lng', to.lng());

    return this._http
      .get<any[]>(`${this.url}/api/Client/Caterings`, { params })
      .toPromise();
  }

  public getMenu(id: any): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Client/Caterings/${id}/Menu`)
      .toPromise();
  }
}

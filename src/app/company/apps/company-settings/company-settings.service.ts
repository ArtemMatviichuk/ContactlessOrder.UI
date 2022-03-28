import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { serialize } from 'object-to-formdata';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CompanySettingsService extends AuthService {
  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super(_router, _http);
  }

  public getCompany() {
    return this._http.get<any>(`${this.url}/api/Companies`).toPromise();
  }

  public getCompanyLogo() {
    return this._http
      .get(`${this.url}/api/Companies/Logo`, { responseType: 'blob' })
      .toPromise();
  }

  public updateCompanyData(data) {
    const formData = serialize(data, {
      nullsAsUndefineds: true,
      indices: true,
    });

    if (data.logo) {
      formData.append('logo', data.logo, data.logo.name);
    }

    return this._http
      .put<void>(`${this.url}/api/Companies/Update`, formData)
      .toPromise();
  }

  public getCatering(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Companies/Caterings`)
      .toPromise();
  }

  public createCatering(data: any) {
    return this._http
      .post<void>(`${this.url}/api/Companies/Caterings`, data)
      .toPromise();
  }

  public updateCatering(id: any, data: any) {
    return this._http
      .put<void>(`${this.url}/api/Companies/Caterings/${id}`, data)
      .toPromise();
  }
}

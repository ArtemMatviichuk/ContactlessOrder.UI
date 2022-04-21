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
      .post<any>(`${this.url}/api/Companies/Caterings`, data)
      .toPromise();
  }

  public updateCatering(id: any, data: any) {
    return this._http
      .put<void>(`${this.url}/api/Companies/Caterings/${id}`, data)
      .toPromise();
  }

  public deleteCatering(id: any) {
    return this._http
      .delete<void>(`${this.url}/api/Companies/Caterings/${id}`)
      .toPromise();
  }

  public generateCateringPassword(id: any) {
    return this._http
      .put<any>(
        `${this.url}/api/Companies/Caterings/${id}/RegeneratePassword`,
        {}
      )
      .toPromise();
  }

  public getMenu(): Promise<any[]> {
    return this._http.get<any[]>(`${this.url}/api/Companies/Menu`).toPromise();
  }

  public getMenuOptions(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Companies/MenuOptions`)
      .toPromise();
  }

  public createMenuItem(data: any) {
    const formData = serialize(data, {
      nullsAsUndefineds: true,
      indices: true,
    });

    if (data.pictures?.length > 0) {
      data.pictures.forEach((p) => formData.append('pictures', p, p.name));
    }

    return this._http
      .post<void>(`${this.url}/api/Companies/Menu`, formData)
      .toPromise();
  }

  public updateMenuItem(id: any, data: any) {
    const formData = serialize(data, {
      nullsAsUndefineds: true,
      indices: true,
    });

    if (data.pictures?.length > 0) {
      data.pictures.forEach((p) => formData.append('pictures', p, p.name));
    }

    return this._http
      .put<void>(`${this.url}/api/Companies/Menu/${id}`, formData)
      .toPromise();
  }

  public deleteMenuItem(id: any) {
    return this._http
      .delete<void>(`${this.url}/api/Companies/Menu/${id}`)
      .toPromise();
  }

  public getMenuItemPictures(id: any) {
    return this._http
      .get<any[]>(`${this.url}/api/Companies/Menu/${id}/Pictures`)
      .toPromise();
  }

  public getMenuItemPictureUrl(id: any) {
    return `${this.url}/api/Companies/Menu/Pictures/${id}/File`;
  }

  public getModifications(): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Companies/Modifications`)
      .toPromise();
  }

  public createModifications(modifications: any[]) {
    return this._http
      .post<void>(`${this.url}/api/Companies/Modifications`, { value: modifications })
      .toPromise();
  }

  public updateModification(id: any, data: any) {
    return this._http
      .put<void>(`${this.url}/api/Companies/Modifications/${id}`, data)
      .toPromise();
  }

  public deleteModification(id: any) {
    return this._http
      .delete<void>(`${this.url}/api/Companies/Modifications/${id}`)
      .toPromise();
  }
}

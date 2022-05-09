import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService extends AuthService {
  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super(_router, _http);
  }

  public getCompanies(approved: boolean) {
    return this._http
      .get<any[]>(`${this.url}/api/Admin/Companies`, { params: { approved } })
      .toPromise();
  }

  public getCompanyPaymentData(paymentDataId: any) {
    return this._http
      .get<any>(`${this.url}/api/Admin/PaymentData/${paymentDataId}`)
      .toPromise();
  }
  
  public approveCompany(id: any) {
    return this._http
      .put<any>(`${this.url}/api/Admin/Companies/${id}/Approve`, {})
      .toPromise();
  }

  public getCaterings(companyId: any): any {
    return this._http
      .get<any>(`${this.url}/api/Admin/Companies/${companyId}/Caterings`)
      .toPromise();
  }
  
  public rejectCompany(id: any) {
    return this._http
      .put<any>(`${this.url}/api/Admin/Companies/${id}/Reject`, {})
      .toPromise();
  }
}

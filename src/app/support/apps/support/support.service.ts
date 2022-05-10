import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SupportService extends AuthService {
  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super(_router, _http);
  }

  public getComplains(status: number): Promise<any[]> {
    return this._http
      .get<any[]>(`${this.url}/api/Support/Complains/${status}`)
      .toPromise();
  }

  public changeComplainStatus(id: any, status: number) {
    return this._http
      .put<void>(`${this.url}/api/Support/Complains/${id}/Status`, {
        value: status,
      })
      .toPromise();
  }
}

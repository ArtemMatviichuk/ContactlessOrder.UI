import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public url = environment.apiURL;

  constructor(
    protected readonly _router: Router,
    private readonly _httpClient: HttpClient
  ) {}

  public async login(email, password): Promise<any> {
    return this._httpClient
      .post<any>(this.url + '/api/Auth', {
        email,
        password,
      })
      .toPromise();
  }

  public googleLogin(sendData: any) {
    return this._httpClient
      .post<any>(this.url + '/api/Auth/GoogleLogin', sendData)
      .toPromise();
  }

  public register(formValue: any) {
    return this._httpClient
      .post<any>(this.url + '/api/Auth/Register', formValue)
      .toPromise();
  }
  
  public registerCompany(formValue: any) {
    return this._httpClient
      .post<any>(this.url + '/api/Auth/RegisterCompany', formValue)
      .toPromise();
  }

  public confirmEmail(token: string) {
    return this._httpClient
      .post<any>(
        this.url + '/api/Auth/ConfirmEmail',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .toPromise();
  }

  /**
   * Create headers for API
   * @returns {{ headers: HttpHeaders }}
   */
  public createAuthorizationHeader(): any {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      };
    } else {
      this._router.navigate(['/auth/login']);
    }
  }

  public isLoggedIn(): boolean {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const isExpired = jwtHelper.isTokenExpired(token);

    return !isExpired;
  }

  public isCompany(): boolean {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    const user = jwtHelper.decodeToken(token);

    return user.CompanyId !== "";
  }

  public logout(returnUrl?: string) {
    localStorage.removeItem('token');

    this._router.navigate(['auth/login'], { queryParams: { returnUrl } });
  }

  public getEmail() {
    return localStorage.getItem('email');
  }

  public getFullName() {
    const token = localStorage.getItem('token');

    const user = new JwtHelperService().decodeToken(token);

    return `${user.FirstName} ${user.LastName}`;
  }

  public tokenGetter() {
    const token = localStorage.getItem('token');
    if (!token) {
      this._router.navigate(['/auth/login']);
    }
    return token;
  }

  public validateEmail(id: number, email: string): Observable<any> {
    return this._httpClient.post<any>(`${this.url}/api/Auth/ValidateEmail`, {
      id,
      value: email,
    });
  }

  public validatePhoneNumber(id: number, phoneNumber: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this.url}/api/Auth/ValidatePhoneNumber`,
      {
        id,
        value: phoneNumber,
      }
    );
  }
  
  public validateCompanyName(id: null, name: any): Observable<any> {
    return this._httpClient.post<any>(
      `${this.url}/api/Auth/ValidateCompanyName`,
      {
        id,
        value: name,
      }
    );
  }
}

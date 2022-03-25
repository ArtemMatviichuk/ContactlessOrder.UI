import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public url = environment.apiURL;

  constructor(
    protected readonly _router: Router,
    private readonly _httpClient: HttpClient
  ) {}

  public async login(email, password): Promise<any> {
    return this._httpClient
      .post(this.url + "/api/Auth", {
        email,
        password,
      })
      .toPromise();
  }

  /**
   * Create headers for API
   * @returns {{ headers: HttpHeaders }}
   */
  public createAuthorizationHeader(): any {
    const token = localStorage.getItem("token");
    if (token) {
      return {
        headers: new HttpHeaders({
          Authorization: "Bearer " + token,
        }),
      };
    } else {
      this._router.navigate(["/auth/login"]);
    }
  }

  public isLoggedIn(): boolean {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem("token");

    if (!token) {
      return false;
    }

    const isExpired = jwtHelper.isTokenExpired(token);

    return !isExpired;
  }

  public logout(returnUrl?: string) {
    localStorage.removeItem("token");

    this._router.navigate(["auth/login"], { queryParams: { returnUrl } });
  }

  public getEmail() {
    return localStorage.getItem("email");
  }

  public getFullName() {
    const token = localStorage.getItem("token");

    const user = new JwtHelperService().decodeToken(token);

    return `${user.FirstName} ${user.LastName}`;
  }

  public tokenGetter() {
    const token = localStorage.getItem("token");
    if (!token) {
      this._router.navigate(["/auth/login"]);
    }
    return token;
  }
}

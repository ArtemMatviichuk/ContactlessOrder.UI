import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpCancelService } from './http-cancel.service';
import { SharedService } from './shared.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private httpCancelService: HttpCancelService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = this.router.url;

    if (
      !this.authService.isLoggedIn() &&
      url.indexOf('/auth/login') === -1 &&
      url.indexOf('/auth/register') === -1 &&
      url.indexOf('/auth/register-company') === -1 &&
      url.indexOf('/auth/confirm-email') === -1 &&
      url.indexOf('/auth/catering') === -1
    ) {
      setTimeout(() => {
        this.dialog.closeAll();
        this.sharedService.stopBlockUI();
      });

      this.authService.logout(url);

      return throwError(null);
    }

    if (
      this.authService.isLoggedIn() &&
      url.indexOf('/auth/confirm-email') === -1
    ) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authService.tokenGetter()}`,
        },
      });
    }

    return next
      .handle(req)
      .pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
  }
}

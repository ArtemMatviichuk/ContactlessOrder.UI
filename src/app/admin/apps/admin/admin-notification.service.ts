import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { SignalrService } from 'src/app/shared/services/signalr.service';

@Injectable()
export class AdminNotificationService extends SignalrService {
  private companyAdded = new Subject<any>();
  public onCompanyAdded = (): Observable<any> => this.companyAdded;

  private companyUpdated = new Subject<any>();
  public onCompanyUpdated = (): Observable<any> => this.companyUpdated;

  private userRegistered = new Subject<any>();
  public onUserRegistered = (): Observable<any> => this.userRegistered;

  private userUpdated = new Subject<any>();
  public onUserUpdated = (): Observable<any> => this.userUpdated;
  
  private userDeleted = new Subject<any>();
  public onUserDeleted = (): Observable<any> => this.userDeleted;

  constructor(
    protected readonly _router: Router,
    private readonly _http: HttpClient
  ) {
    super('admin', _router, _http);
  }

  protected registerMethods(): void {
    this.connection.on('CompanyCreated', (company) =>
      this.companyAdded.next(company)
    );

    this.connection.on('CompanyUpdated', (company) =>
      this.companyUpdated.next(company)
    );

    this.connection.on('UserRegistered', (user) =>
      this.userRegistered.next(user)
    );

    this.connection.on('UserUpdated', (user) =>
      this.userUpdated.next(user)
    );
    
    this.connection.on('UserDeleted', (id) =>
      this.userDeleted.next(id)
    );
  }
}

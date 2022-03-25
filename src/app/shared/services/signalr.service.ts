import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import * as signalR from "@microsoft/signalr";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";

export abstract class SignalrService extends AuthService {
  protected connection: signalR.HubConnection;

  private readonly numberOfRetries = 10;
  private retriesLeft = this.numberOfRetries;

  constructor(private readonly route: string, _router: Router, _http: HttpClient) {
    super(_router, _http);

    this.buildConnection();
    this.registerMethods();
  }

  public async connect(): Promise<void> {
    try {
      if (this.connection.state !== signalR.HubConnectionState.Connected) {
        await this.connection.start();

        this.retriesLeft = this.numberOfRetries;
      }
    } catch (err) {
      this.retriesLeft--;

      if (this.retriesLeft > 0) {
        setTimeout(() => this.connect(), 10000);
      }
    }
  }

  public disconnect(): Promise<void> {
    return this.connection.stop();
  }

  private buildConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiURL}/${this.route}`, {
        accessTokenFactory: this.tokenGetter,
      })
      .build();

    this.connection.serverTimeoutInMilliseconds = 1000 * 60 * 2;
    this.connection.keepAliveIntervalInMilliseconds = 1000 * 60;

    this.connection.onclose(async (error) => {
      if (error) {
        await this.connect();
      }
    });
  }

  protected abstract registerMethods(): void;
}

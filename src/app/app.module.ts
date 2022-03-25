import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { BrowserModule } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
import { BlockUIModule } from "ng-block-ui";
import { ToastrModule } from "ngx-toastr";
import { AppRoutes } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AppHttpInterceptor } from "./shared/services/app-http-interceptor";
import { AuthService } from "./shared/services/auth.service";

export function jwtOptionsFactory(authservice) {
  return {
    tokenGetter: () => {
      return authservice.tokenGetter();
    },
    whitelistedDomains: ["localhost:5001"],
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    NoopAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    RouterModule.forRoot(AppRoutes, { relativeLinkResolution: 'legacy' }),
    ToastrModule.forRoot(),
    BlockUIModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthService],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

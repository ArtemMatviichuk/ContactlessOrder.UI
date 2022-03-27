import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ClientGuardService } from './shared/services/client-guard.service';
import { CompanyGuardService } from './shared/services/company-guard.service';

export const AppRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'business',
    loadChildren: () =>
      import('./company/routing/full.module').then((m) => m.FullModule),
    canActivate: [CompanyGuardService],
  },
  {
    path: '',
    loadChildren: () =>
      import('./client/routing/full.module').then((m) => m.FullModule),
    canActivate: [ClientGuardService],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

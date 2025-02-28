import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { AdminGuardService } from './shared/services/admin-guard.service';
import { CateringGuardService } from './shared/services/catering-guard.service';
import { ClientGuardService } from './shared/services/client-guard.service';
import { CompanyGuardService } from './shared/services/company-guard.service';
import { SupportGuardService } from './shared/services/support-guard.service';

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
    path: 'catering',
    loadChildren: () =>
      import('./catering/routing/full.module').then((m) => m.FullModule),
    canActivate: [CateringGuardService],
  },
  {
    path: 'support',
    loadChildren: () =>
      import('./support/routing/full.module').then((m) => m.FullModule),
    canActivate: [SupportGuardService],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/routing/full.module').then((m) => m.FullModule),
    canActivate: [AdminGuardService],
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

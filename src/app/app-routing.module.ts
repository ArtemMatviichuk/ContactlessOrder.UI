import { Routes } from '@angular/router';
import { AuthGuardService } from './shared/services/auth-guard.service';

export const AppRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./layouts/full/full.module').then((m) => m.FullModule),
    canActivate: [AuthGuardService],
  },
];
